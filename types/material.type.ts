import { BaseType, PaginationType } from "@sera-types/base.type";

export interface Material {
  id?: string;
  no?: number;
  customerCode?: string | null;
  customerName?: string | null;
  code?: string;
  name?: string;
  brand?: string | null;
  barcode?: string | null;
  description?: string | null;
  category?: string;
  uoM?: string | null;
  isActive?: boolean;
  createdDate?: string;
  createdBy?: string | null;
  modifiedDate?: string | null;
  modifiedBy?: string | null;
}

export interface MaterialDropdown {
  id?: string;
  code?: string;
  name?: string;
  brand?: string | null;
}

export interface GetMaterialsResponse extends BaseType {
  pagination?: PaginationType;
  data?: Material[] | [];
}

export interface MaterialState {
  data?: Material[];
  isLoading?: boolean;
  error?: Error | string | null;
  options?: BaseType;
  materialDetail: { data: Material | null };
  dropdownMaterials: { data: MaterialDropdown[] };
}

export const materialTypes = {
  GET_MATERIALS: "GET_MATERIALS",
  GET_MATERIAL_DETAIL: "GET_MATERIAL_DETAIL",
  CREATE_MATERIAL: "CREATE_MATERIAL",
  UPDATE_MATERIAL: "UPDATE_MATERIAL",
  DELETE_MATERIAL: "DELETE_MATERIAL",
  GET_DROPDOWN_MATERIALS: "GET_DROPDOWN_MATERIALS",
} as const;
