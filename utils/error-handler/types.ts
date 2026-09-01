import { User } from "../../types/glitchtip.type";

interface APIConfigErrorResponse {
  baseURL?: string;
  params?: any;
  url?: string;
}

interface APIDataErrorResponse {
  message?: string;
}

export interface ApiErrorAxios {
  transactionId: string;
  code: string;
  data: unknown;
  message: string;
  errors: { field: string; message: string[] }[];
}

export interface APIErrorApiResponse {
  config?: APIConfigErrorResponse;
  data?: APIDataErrorResponse;
  status?: number;
  statusText?: string;
}

export interface GetErrorApiResponse {
  message?: string;
  params?: any;
  statusText?: string;
  url?: string;
}

export interface ApiContextProps {
  apiUrl: string;
  fileName: string;
  functionName: string;
  pageUrl: string;
  rowNumber: number;
}

export interface ErrorContextProps {
  fileName: string;
  functionName: string;
  pageUrl: string;
  rowNumber: number;
}

export interface SentryOptions {
  apiContext?: ApiContextProps;
  errorContext?: ErrorContextProps;
  exception?: string;
  message: string;
  user: User;
}

export type HttpStatusCodesProps = {
  code: number;
  message: string;
  text: string;
  type: "success" | "failed";
};
