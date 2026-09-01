import { BaseType, PaginationType } from "@sera-types/base.type";

/** WMS tenant customer (User Management module). */
export interface Customer {
  no?: number;
  id?: string;
  code?: string;
  name?: string;
  address?: string;
  phone?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  deletedAt?: string;
  deletedBy?: string;
  warehouses?: WmsWarehouse[];
}

export interface GetCustomersResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: Customer[] | [];
  code?: string;
  eTag?: string;
  pagination?: PaginationType;
}

export interface CustomerState {
  data?: Customer[];
  isLoading?: boolean;
  error?: Error | string | null;
  options?: BaseType;
  customerDetail: { data: Customer };
  createCustomer: { data: GetCustomersResponse[] };
  updateCustomer: { data: GetCustomersResponse[] };
  postCreateCustomer: { code: string; name: string };
  postUpdateCustomer: { id: string; name: string };
  postDeleteCustomer: { id: string; name: string; options?: any };
}

/** WMS warehouse (User Management module). */
export interface WmsWarehouse {
  no?: number;
  id?: string;
  customerId?: string;
  code?: string;
  name?: string;
  address?: string;
  phone?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  deletedAt?: string;
  deletedBy?: string;
  customer?: { id?: string; name?: string; code?: string };
}

export interface GetWmsWarehousesResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: WmsWarehouse[] | [];
  code?: string;
  eTag?: string;
  pagination?: PaginationType;
}

export interface WmsWarehouseState {
  data?: WmsWarehouse[];
  isLoading?: boolean;
  error?: Error | string | null;
  options?: BaseType;
  warehouseDetail: { data: WmsWarehouse };
  createWarehouse: { data: GetWmsWarehousesResponse[] };
  updateWarehouse: { data: GetWmsWarehousesResponse[] };
  dropdownWarehouses: { data: WmsWarehouse[] };
  postCreateWarehouse: { code: string; name: string };
  postUpdateWarehouse: { id: string; name: string };
  postDeleteWarehouse: { id: string; name: string; options?: any };
}
