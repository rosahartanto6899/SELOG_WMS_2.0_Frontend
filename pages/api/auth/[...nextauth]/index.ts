/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { decryptData } from "@sera-utils/encryptor";
import { AxiosResponse } from "axios";
import CryptoJS from "crypto-js";
import _ from "lodash";
import NextAuth, { NextAuthOptions, SessionStrategy } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";

import UserApi from "../../../../libraries/api/auth";
import {
  CustomSession,
  LoginData,
  LoginResponse,
  PayloadLogin,
  PayloadLoginInternal,
  PayloadLoginLocal,
  PayloadRefreshToken,
} from "../../../../types/auth.type";
import Utils from "../../../../utils/utils";

const useSecureCookies = Utils().isSecureUrl(process.env.NEXTAUTH_URL ?? "");
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const hostName = Utils().getDomainName(process.env.NEXTAUTH_URL ?? "");
const maxAge = 1 * 60 * 60;
const isLoginOTP =
  (decryptData(process.env.TOGGLE_OTP_LOGIN) as string).toLowerCase() ===
  "true";
const isLoginCaptcha =
  (decryptData(process.env.TOGGLE_CAPTCHA_LOGIN) as string).toLowerCase() ===
  "true";

const refreshAccessToken = async (token: LoginResponse | any) => {
  // try {
  const { refreshToken } = token.data;

  const payload: PayloadRefreshToken = {
    refreshToken,
  };

  const response: AxiosResponse = await UserApi().refreshToken(payload);

  if (response.status === 200) {
    return { ...response.data, accessTokenExpires: Date.now() + maxAge * 1000 };
  }

  throw new Error(
    JSON.stringify({ errors: response.data, status: false, ok: false }),
  );
  // } catch (error) {
  //   return {
  //     ...token,
  //     error: 'RefreshAccessTokenError',
  //   };
  // }
};

const authOptions: NextAuthOptions = {
  debug: false,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge,
  },
  providers: [
    AzureADProvider({
      clientId: decryptData(process.env.MSAL_CLIENT_ID),
      clientSecret: decryptData(process.env.MSAL_CLIENT_SECRET),
      tenantId: decryptData(process.env.MSAL_TENANT_ID),
      authorization: {
        params: {
          scope: `openid profile email profile offline_access`,
        },
      },
      idToken: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password, otp, loginMethod } =
          credentials as PayloadLogin;
        let payload: PayloadLogin = {
          username,
          password: decryptData(password).toString(CryptoJS.enc.Utf8),
          otp,
          loginMethod,
        };

        if (!isLoginOTP && !isLoginCaptcha) {
          payload = _.omit(payload, ["otp", "loginMethod"]);
        }
        const response: AxiosResponse = await UserApi().loginUser(payload);
        if (response.status === 200) {
          return {
            ...response.data,
            accessTokenExpires: Date.now() + maxAge * 1000,
          };
        }

        throw new Error(
          JSON.stringify({ errors: response.data, status: false, ok: false }),
        );
      },
    }),
    CredentialsProvider({
      name: "Credentials Local",
      id: "credentials-local",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        try {
          const decryptedPassword = decryptData(password);
          const payload: PayloadLoginLocal = {
            email,
            password:
              typeof decryptedPassword === "string"
                ? decryptedPassword
                : decryptedPassword.toString(CryptoJS.enc.Utf8),
            provider: "local",
          };
          console.log(
            "[credentials-local] URL:",
            `${decryptData(process.env.SERVICE_USER)}/login/local`,
          );
          console.log(
            "[credentials-local] payload:",
            JSON.stringify({
              email: payload.email,
              provider: payload.provider,
            }),
          );
          const response: AxiosResponse = await UserApi().loginLocal(payload);
          console.log(
            "[credentials-local] response status:",
            response?.status,
            "data:",
            JSON.stringify(response?.data),
          );
          if (response?.status === 200) {
            return {
              ...response.data,
              accessTokenExpires: Date.now() + maxAge * 1000,
            };
          }

          const errorData = response?.data ?? (response as any)?.response?.data;
          throw new Error(
            JSON.stringify({
              errors: errorData ?? {
                code: "LOGIN_FAILED",
                message: "Login failed",
              },
              status: false,
              ok: false,
            }),
          );
        } catch (error: any) {
          if (error.message?.startsWith("{")) throw error;
          throw new Error(
            JSON.stringify({
              errors: {
                code: "INTERNAL_ERROR",
                message: error.message || "Login failed",
              },
              status: false,
              ok: false,
            }),
          );
        }
      },
    }),
  ],
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: useSecureCookies,
        domain: hostName,
      },
    },
    state: {
      name: `${cookiePrefix}next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        maxAge: 900,
      },
    },
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  callbacks: {
    signIn: async (message) => {
      if (message.account?.provider === "azure-ad") {
        const payloadLoginInternal: PayloadLoginInternal = {
          token: message.account.access_token ?? "",
          provider: message.account.provider,
        };
        const response: AxiosResponse =
          await UserApi().loginUserInternal(payloadLoginInternal);

        if (response.status !== 200) return false;
      }
      return true;
    },
    jwt: async ({ token, user, account, trigger, session }) => {
      if (trigger === "update" && session?.detail) {
        token.data = session.detail.data;
      }

      if (account?.provider === "azure-ad") {
        token = {
          ...token,
          tokenId: account.access_token,
          loginProvider: "azure-ad",
        };

        const payloadLoginInternal: PayloadLoginInternal = {
          token: account?.access_token ?? null,
          provider: account.provider,
        };
        const response: AxiosResponse =
          await UserApi().loginUserInternal(payloadLoginInternal);
        if (response.status === 200) {
          return Promise.resolve({
            ...response.data,
            accessTokenExpires: Date.now() + maxAge * 1000,
          });
        }

        token.refreshToken = account.refresh_token;
        token.user = user;
        token.accessTokenExpires = Date.now() + maxAge * 1000;
      } else if (
        account?.provider === "credentials" ||
        account?.provider === "credentials-local"
      ) {
        token = { ...token, ...user, loginProvider: account.provider };
      }

      // If accessTokenExpiry is 1 hours, we have to refresh token before 1 hours pass.
      const accessTokenExpires = token?.accessTokenExpires ?? 0;
      const shouldRefreshTime = Math.round(
        Number(accessTokenExpires) - Date.now(),
      );

      // Return previous token if the access token has not expired yet
      if (shouldRefreshTime > 5 * 60 * 1000 + 500) {
        return Promise.resolve(token);
      }

      // Access token has expired, try to update it
      try {
        const refreshToken = await refreshAccessToken(token);

        const newToken = {
          transactionId: refreshToken.transactionId,
          code: refreshToken.code,
          message: refreshToken.message,
          eTag: refreshToken.etag,
          data: {
            type: refreshToken.data.type,
            accessToken: refreshToken.data.accessToken,
            refreshToken: refreshToken.data.refreshToken,
            user: {
              id: (token.data as any).user.id,
              email: (token.data as any).user.email,
              name: (token.data as any).user.name,
              role: (token.data as any).user.role,
              roleName: (token.data as any).user.roleName,
              roles: (token.data as any).user.roles,
              isInternal: (token.data as any).user.isInternal,
              customerId: (token.data as any).user.customerId,
              customers: (token.data as any).user.customers,
            },
          },
          accessTokenExpires: refreshToken.accessTokenExpires,
        };

        return Promise.resolve(newToken);
      } catch {
        // Refresh failed (revoked/expired refresh token). Keep the old token;
        // the client's 401 interceptor handles logout. Throwing here made
        // /api/auth/session return 500, which froze useSession in "loading"
        // forever (next-auth v4) on every page including /auth.
        return Promise.resolve(token);
      }
    },
    session: async ({ session, token }) => {
      const { data } = token;
      const { user } = data as LoginData;

      if (data) {
        session = {
          ...session,
          accessTokenExpires: token.accessTokenExpires,
          loginProvider: token.loginProvider as string | undefined,
          user: {
            ...session.user,
            name: user.name,
            id: user.id,
            email: user.email,
            isInternal: user.isInternal,
            role: user.role,
            roleName: user.roleName,
            roles: user.roles,
            customerId: user.customerId,
            customers: user.customers,
          },
          detail: {
            data: {
              ...data,
            },
          },
        } as unknown as CustomSession;
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
