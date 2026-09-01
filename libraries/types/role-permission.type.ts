export type RolePermissionDataTypeKey = "v" | "e" | "a"; // v = visible, e = enable, a = active

export interface RolePermissionUpdatedFormData {
  permissionId: number;
  v: number;
  e: number;
  a: number;
}

export interface RolePermissionChecboxData {
  v: boolean;
  e: boolean;
  a: boolean;
}

export interface Role {
  name: string;
  permissions: [];
}

export interface RolePermissionData {
  a: boolean;
  e: boolean;
  v: boolean;
  type: boolean;
  applicationId: number;
  attributeId: string;
  featureName: string;
  parentFeatureId: number;
  permissionId: number;
  uniqueKey: string;
}

export interface RolePermission {
  message: string;
  nextPage: number | null;
  page: number;
  row: number;
  total: number;
  transactionId: string;
  data: RolePermissionData[];
}

export interface DataType extends RolePermissionData {
  active?: boolean;
  enable?: boolean;
  key?: number;
  visible?: boolean;
  children?: DataType[];
}
