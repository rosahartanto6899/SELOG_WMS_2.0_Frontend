import { BaseType, PaginationType } from "@sera-types/base.type";

export interface Location {
  id?: string;
  no?: number;
  customerCode?: string | null;
  warehouseCode?: string | null;
  warehouseName?: string | null;
  code?: string;
  name?: string;
  barcode?: string | null;
  description?: string | null;
  category?: string | null;
  zoneId?: string | null;
  zoneName?: string | null;
  isActive?: boolean;
  createdDate?: string;
  createdBy?: string | null;
  modifiedDate?: string | null;
  modifiedBy?: string | null;
}

export interface LocationDropdown {
  id?: string;
  code?: string;
  name?: string;
}

export interface BarcodeLabel {
  barcode: string;
  code?: string;
  name?: string;
  image?: string; // svg data-uri
}

export interface GetLocationsResponse extends BaseType {
  pagination?: PaginationType;
  data?: Location[] | [];
}

export interface LocationState {
  data?: Location[];
  isLoading?: boolean;
  error?: Error | string | null;
  options?: BaseType;
  locationDetail: { data: Location | null };
  dropdownLocations: { data: LocationDropdown[] };
}

export const locationTypes = {
  GET_LOCATIONS: "GET_LOCATIONS",
  GET_LOCATION_DETAIL: "GET_LOCATION_DETAIL",
  CREATE_LOCATION: "CREATE_LOCATION",
  UPDATE_LOCATION: "UPDATE_LOCATION",
  DELETE_LOCATION: "DELETE_LOCATION",
  GET_DROPDOWN_LOCATIONS: "GET_DROPDOWN_LOCATIONS",
} as const;
