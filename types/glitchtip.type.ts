export type IsInternal = 0 | 1;

export interface ApiResponse {
  code?: string;
  data?: object;
  message?: string;
  status?: number;
}

export interface User {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  roleName?: string;
  fleetGroup?: string;
  isInternal?: IsInternal;
}

export interface ApiContext {
  url?: string;
  endpoint?: string;
  payload?: object;
  apiResponse?: ApiResponse;
}
