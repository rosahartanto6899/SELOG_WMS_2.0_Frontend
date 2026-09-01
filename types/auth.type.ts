import { Session } from "next-auth";

export type StatusResponse = 0 | 1;
export type IsInternal = 0 | 1;
export type StatusAuth = "loading" | "authenticated" | "unauthenticated";

export interface PayloadLogin {
  username: string;
  password: string;
  otp?: string;
  loginMethod?: "otp" | "captcha";
  regenerate?: boolean;
}

export interface PayloadRegister {
  email: string;
  password: string;
  passwordConfirmation: string;
  isIndividual: boolean;
  ownerName: string;
  title?: string;
  businessEntity?: string;
  trademarkName?: string;
  companyName?: string;
  businessFields?: string[];
}

export interface PayloadLoginInternal {
  token: string | null;
  provider: string;
}

export interface DataUser {
  id: string;
  email: string;
  name: string;
  role: string;
  roles: {
    id: string;
    name: string;
    warehouses: string[];
    customers: string[];
  }[];
  customerId?: string | null;
  customers?: string[];
  roleName: string;
  fleetGroup: string;
  isInternal: IsInternal;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  user: DataUser;
}

export interface LoginResponse {
  status: StatusResponse;
  data: LoginData;
  code: string;
  message: string;
  eTag: string;
  accessTokenExpires?: number;
}

export interface CustomSession extends Session {
  accessTokenExpires: number;
  detail: LoginResponse;
  loginProvider?: string;
}

export interface CustomUseSession {
  data: CustomSession;
  status: StatusAuth;
  update: unknown;
}

export interface PayloadResetPassword {
  token: string;
  password: string;
  passwordConfirmation: string;
}

export interface PayloadLoginLocal {
  email: string;
  password: string;
  provider: "local";
}

export interface PayloadRefreshToken {
  refreshToken: string;
}
