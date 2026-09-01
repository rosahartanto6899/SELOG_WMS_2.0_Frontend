import React from "react";

export type OrderByType = "asc" | "desc";

export interface PaginationType {
  page: number;
  limit: number;
  totalData?: number | null;
  totalPage?: number | null;
}

export interface BaseType extends PaginationType {
  sort?: OrderByType | string | null;
  order?: string | null;
  search?: string | null;
  searchBy?: string | null;
}

export interface BaseState<T = unknown, U = unknown> {
  isLoading?: boolean;
  error?: Error | string | null;
  data: T;
  options?: BaseType;
  payload?: U extends undefined ? T : U;
}

export interface AutoCompleteType {
  label?: string | React.ReactNode | null;
  value?: string | number | null;
}

export interface BaseResponseType extends PaginationType {
  status?: boolean;
  message?: string;
  code?: string;
  transactionId?: string;
  eTag?: Error | string | null;
}

export interface BaseResponseData {
  createdAt?: string;
  createdBy?: string | null;
  createdByName?: string | null;
  deletedAt?: string;
  deletedBy?: string | null;
  updatedAt?: string;
  updatedBy?: string | null;
}

export interface BaseListResponse<T = unknown> extends BaseType {
  status?: boolean;
  message?: string;
  data: T;
  pagination?: PaginationType;
  code?: string;
}

export type RequiredMarkType = boolean | "optional";
