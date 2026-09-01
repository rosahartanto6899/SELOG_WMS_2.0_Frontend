import { ColumnsType } from "antd/lib/table/interface";
import { NextPage } from "next";
import { Session } from "next-auth";

export type NextAppPage<P = unknown, IP = P> = NextPage<P, IP> & {
  setNotFound?: boolean;
};

export interface CustomSession extends Session {
  accessToken?: string;
  refreshToken?: string;
  error?: string | "AccessTokenExpired";
  oid?: string;
  id?: string;
  email?: string;
  fleetGroup?: string;
  isInternal?: 0 | 1;
  name?: string;
  role?: string;
}

export interface NextAuthSession {
  data: CustomSession | null;
  status: string;
}

export interface TableColumn extends ColumnsType<object> {
  hidden?: boolean;
  disabled?: boolean;
}

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & unknown;
