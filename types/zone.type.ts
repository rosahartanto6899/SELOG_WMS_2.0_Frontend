import { BaseType, PaginationType } from "@sera-types/base.type";

export interface Zone {
  id?: string;
  no?: number;
  customerCode?: string | null;
  customerName?: string | null;
  warehouseCode?: string | null;
  warehouseName?: string | null;
  code?: string;
  name?: string;
  description?: string | null;
  isActive?: boolean;
  createdDate?: string;
  createdBy?: string | null;
  modifiedDate?: string | null;
  modifiedBy?: string | null;
}

export interface ZoneDropdown {
  id?: string;
  code?: string;
  name?: string;
}

export interface GetZonesResponse extends BaseType {
  pagination?: PaginationType;
  data?: Zone[] | [];
}

export interface ZoneState {
  data?: Zone[];
  isLoading?: boolean;
  error?: Error | string | null;
  options?: BaseType;
  zoneDetail: { data: Zone | null };
  dropdownZones: { data: ZoneDropdown[] };
}

export const zoneTypes = {
  GET_ZONES: "GET_ZONES",
  GET_ZONE_DETAIL: "GET_ZONE_DETAIL",
  CREATE_ZONE: "CREATE_ZONE",
  UPDATE_ZONE: "UPDATE_ZONE",
  DELETE_ZONE: "DELETE_ZONE",
  GET_DROPDOWN_ZONES: "GET_DROPDOWN_ZONES",
} as const;
