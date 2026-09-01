import { httpService } from "@sera-libraries/http-service";

import {
  PayloadLogin,
  PayloadLoginInternal,
  PayloadLoginLocal,
  PayloadRefreshToken,
  PayloadRegister,
  PayloadResetPassword,
} from "../../../types/auth.type";
import apiUrl from "../../common/api-url";

/**
 * Handles API call related to user.
 * @class
 */
const UserApi = () => {
  // Login User
  async function loginUser(payload: PayloadLogin) {
    return httpService
      .post(`${apiUrl.user}/login`, payload)
      .then((resp) => resp)
      .catch((err) => err);
  }

  async function loginUserInternal(payload: PayloadLoginInternal) {
    return httpService
      .post(`${apiUrl.user}/login`, payload)
      .then((resp) => resp)
      .catch((err) => err);
  }

  async function loginLocal(payload: PayloadLoginLocal) {
    const url = `${apiUrl.user}/login/local`;
    console.log("[loginLocal] Full URL:", url);
    console.log(
      "[loginLocal] httpService baseURL:",
      (httpService.instance().defaults as any).baseURL,
    );
    return httpService
      .post(url, payload)
      .then((resp) => {
        console.log(
          "[loginLocal] response:",
          resp?.status,
          JSON.stringify(resp?.data),
        );
        return resp;
      })
      .catch((err) => {
        console.log("[loginLocal] error:", err?.message ?? err);
        return err;
      });
  }

  // Register User
  async function registerUser(payload: PayloadRegister) {
    return httpService
      .post(`${apiUrl.user}/register`, payload)
      .then((resp) => resp)
      .catch((err) => err);
  }

  // Logout User
  async function logoutUser() {
    return httpService
      .get(`${apiUrl.user}/logout`)
      .then((resp) => resp)
      .catch((err) => err);
  }

  async function switchRole(roleId: string) {
    return httpService
      .post(`${apiUrl.user}/login/switch-role`, { roleId })
      .then((resp) => resp)
      .catch((err) => err);
  }

  async function switchCustomer(customerId: string) {
    return httpService
      .post(`${apiUrl.user}/login/switch-customer`, { customerId })
      .then((resp) => resp)
      .catch((err) => err);
  }

  function resendVerification(email: string) {
    return httpService.post(`${apiUrl.user}/user/verification/resend`, {
      email,
    });
  }

  function checkVerification(token: string) {
    return httpService.get(`${apiUrl.user}/register/activation/${token}`);
  }

  function setPassword(
    token: string,
    password: string,
    passwordConfirm: string,
  ) {
    return httpService.put(`${apiUrl.user}/user/set-password/${token}`, {
      password,
      passwordConfirm,
    });
  }

  // Create API Check Possiblity Reset Password
  async function checkResetPassword(payload: { email: string }) {
    return httpService
      .post(`${apiUrl.user}/forgot-password`, payload)
      .then((resp) => resp)
      .catch((err) => err);
  }

  // Validate token forgot password
  async function forgotPasswordValidation(payload: string) {
    return httpService
      .post(`${apiUrl.user}/auth/forgot-password/validation`, {
        token: payload,
      })
      .then((resp) => resp)
      .catch((err) => err);
  }

  // Submit new forgot password
  async function resetPassword(payload: PayloadResetPassword) {
    return httpService
      .put(`${apiUrl.user}/forgot-password`, payload)
      .then((resp) => resp)
      .catch((err) => err);
  }

  // Refresh Token User Login
  async function refreshToken(payload: PayloadRefreshToken) {
    return httpService
      .get(`${apiUrl.user}/refresh-token`, {
        headers: {
          authorization: `Bearer ${payload.refreshToken}`,
        },
      })
      .then((resp) => resp)
      .catch((err) => err);
  }

  // Get data menu access by role user
  async function retrieveMenuAccessByUser(token: string) {
    return httpService
      .get(`${apiUrl.user}/users-access`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => resp)
      .catch((err) => err);
  }

  return {
    loginUser,
    loginUserInternal,
    loginLocal,
    logoutUser,
    switchRole,
    switchCustomer,
    registerUser,
    resendVerification,
    checkVerification,
    setPassword,
    checkResetPassword,
    forgotPasswordValidation,
    resetPassword,
    refreshToken,
    retrieveMenuAccessByUser,
  };
};

export default UserApi;
