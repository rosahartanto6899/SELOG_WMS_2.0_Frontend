import {
  AutoCompleteType,
  BaseResponseData,
  BaseState,
  BaseType,
  PaginationType,
} from "./base.type";

export interface StockFilters {
  unitTypeId?: string[];
  branchId?: string[];
}

export interface StockManagementState extends BaseState<StockManagement[]> {
  autoComplete: BaseState<AutoCompleteType[]>;
  getSummary: BaseState<Summary, GetStockPayload>;
  createVehicle: BaseState<VehiclePayload>;
  detailVehicle: BaseState<VehicleDetail, DetailVehiclePayload>;
  updateVehicle: BaseState<UpdateVehiclePayload>;
  upsertVehicle: BaseState<VehiclePayload>;
  downloadTemplate: BaseState<null>;
  stockStatus: BaseState<StockStatus[]>;
}

export interface StockManagement extends BaseResponseData {
  no?: number;
  id?: string;
  vin?: string;
  acquisitionDate?: string;
  branchName?: string;
  customerAssignment?: string;
  description?: string | null;
  hasDashcam?: boolean;
  hasObd?: boolean;
  kirExpired?: string;
  kirStatus?: string;
  lastLocation?: string;
  lastUpdateObd?: string;
  licenseExpired?: string;
  licensePlate?: string;
  licenseStatus?: string;
  maintenancePlanEndDate?: string;
  maintenancePlanStartDate?: string;
  maintenanceStatus?: string;
  ownership?: string;
  planRegMaintenance?: string;
  shipmentType?: string;
  status?: string;
  statusObd?: string;
  unitGroup?: string;
  unitType?: string;
  vehicleYear?: string;
}

export interface GetStockResponse extends BaseType {
  transactionId?: string;
  code?: string;
  message?: string;
  eTag?: string;
  data?: StockManagement[];
  pagination?: PaginationType;
}

export interface GetStockPayload {
  branchId?: string[];
  unitTypeId?: string[];
  shipmentType?: string[];
}

export interface UnitDesc {
  uio?: number;
  usp?: number;
  utsp?: number;
  ratioUtsp?: number;
}

export interface UnitBranches extends UnitDesc {
  id?: string;
  branchName?: string;
}

export interface UnitInOut {
  month: number;
  unitIn: number;
  unitOut: number;
  inOutTotal: number;
}

export interface Summary {
  branchUnitData?: {
    unitBranches?: UnitBranches[];
    unitTotal?: UnitDesc;
  };
  unitInOutData?: UnitInOut[];
}

export interface StockStatus {
  id?: string;
  name?: string;
  description?: string;
}

export interface GetSummaryResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: Summary;
  code?: string;
  eTag?: string;
}

export interface VehicleDetail extends VehiclePayload, BaseResponseData {
  id?: string;
  branchName?: string;
  customerAssignment?: string;
  planRegMaintenance?: string;
  vehicleTypeName?: string;
  vehicleTypeGroup?: string;
  vehicleYear?: string;
}

export interface VehiclePayload {
  acquisitionDate?: string;
  actualDisposalDate?: string;
  customerId?: string;
  branchId?: string;
  depreciationStartDate?: string;
  engineNumber?: string;
  fuel?: string;
  hasObd?: number;
  isUSP?: number;
  kirExpired?: string;
  km?: number;
  lastLocation?: string;
  lastLocationUpdatedAt?: string;
  licenseExpired?: string;
  licenseNumber?: string;
  licensePlate?: string;
  ownership?: string;
  planDisposalDate?: string;
  serviceGroupId?: string;
  shipmentType?: string;
  statusObd?: string;
  vehicleDescription?: string;
  vehicleStatus?: string;
  vehicleTypeId?: string;
  vin?: string;
}

export interface DetailVehiclePayload {
  id?: string;
}

export interface UpdateVehiclePayload extends VehiclePayload {
  id?: string;
}

export interface GetVehicleDetailResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: VehicleDetail;
  code?: string;
  eTag?: string;
}

export interface GetStockStatusResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: StockStatus[];
  code?: string;
  eTag?: string;
}

export const stockManagementTypes = {
  GET_STOCK: "stockManagement/getStock",
  GET_STOCK_FETCH: "stockManagement/getStockFetch",
  GET_STOCK_SUCCESS: "stockManagement/getStockSuccess",
  GET_STOCK_FAILURE: "stockManagement/getStockFailure",

  GET_STOCK_AUTOCOMPLETE: "stockManagement/getStockAutoComplete",
  GET_STOCK_AUTOCOMPLETE_FETCH: "stockManagement/getStockAutoCompleteFetch",
  GET_STOCK_AUTOCOMPLETE_SUCCESS: "stockManagement/getStockAutoCompleteSuccess",
  GET_STOCK_AUTOCOMPLETE_FAILURE: "stockManagement/getStockAutoCompleteFailure",

  GET_SUMMARY: "stockManagement/getSummary",
  GET_SUMMARY_FETCH: "stockManagement/getSummaryFetch",
  GET_SUMMARY_SUCCESS: "stockManagement/getSummarySuccess",
  GET_SUMMARY_FAILURE: "stockManagement/getSummaryFailure",

  GET_VEHICLE_DETAIL: "stockManagement/getVehicleDetail",
  GET_VEHICLE_DETAIL_FETCH: "stockManagement/getVehicleDetailFetch",
  GET_VEHICLE_DETAIL_SUCCESS: "stockManagement/getVehicleDetailSuccess",
  GET_VEHICLE_DETAIL_FAILURE: "stockManagement/getVehicleDetailFailure",

  CREATE_VEHICLE: "stockManagement/createVehicle",
  CREATE_VEHICLE_FETCH: "stockManagement/createVehicleFetch",
  CREATE_VEHICLE_SUCCESS: "stockManagement/createVehicleSuccess",
  CREATE_VEHICLE_FAILURE: "stockManagement/createVehicleFailure",

  DETAIL_VEHICLE: "stockManagement/detailVehicle",
  DETAIL_VEHICLE_FETCH: "stockManagement/detailVehicleFetch",
  DETAIL_VEHICLE_SUCCESS: "stockManagement/detailVehicleSuccess",
  DETAIL_VEHICLE_FAILURE: "stockManagement/detailVehicleFailure",

  UPDATE_VEHICLE: "stockManagement/updateVehicle",
  UPDATE_VEHICLE_FETCH: "stockManagement/updateVehicleFetch",
  UPDATE_VEHICLE_SUCCESS: "stockManagement/updateVehicleSuccess",
  UPDATE_VEHICLE_FAILURE: "stockManagement/updateVehicleFailure",

  UPSERT_VEHICLE: "stockManagement/upsertVehicle",
  UPSERT_VEHICLE_FETCH: "stockManagement/upsertVehicleFetch",
  UPSERT_VEHICLE_SUCCESS: "stockManagement/upsertVehicleSuccess",
  UPSERT_VEHICLE_FAILURE: "stockManagement/upsertVehicleFailure",

  DOWNLOAD_TEMPLATE: "stockManagement/downloadTemplate",
  DOWNLOAD_TEMPLATE_FETCH: "stockManagement/downloadTemplateFetch",
  DOWNLOAD_TEMPLATE_SUCCESS: "stockManagement/downloadTemplateSuccess",
  DOWNLOAD_TEMPLATE_FAILURE: "stockManagement/downloadTemplateFailure",

  STOCK_STATUS: "stockManagement/stockStatus",
  STOCK_STATUS_FETCH: "stockManagement/stockStatusFetch",
  STOCK_STATUS_SUCCESS: "stockManagement/stockStatusSuccess",
  STOCK_STATUS_FAILURE: "stockManagement/stockStatusFailure",
};
