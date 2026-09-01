/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AutoCompleteType,
  BaseResponseData,
  BaseState,
  BaseType,
  PaginationType,
} from "./base.type";

export interface CustomerRoutesAutoComplete {
  options: BaseType;
  data: AutoCompleteType[] | [];
}

export interface CustomerRouteState extends BaseState<
  DataCustomerRoute,
  CustomerRouteParams
> {
  autoComplete: BaseState<AutoCompleteType[]>;
  detailCustomerRoute: BaseState<
    DataDetailCustomerRoute,
    DetailCustomerRoutePayload
  >;
  createCustomerRoute: BaseState<CreateCustomerRoutePayload>;
  updateCustomerRoute: BaseState<UpdateCustomerRoutePayload>;
  deleteCustomerRoute: BaseState<DeleteCustomerRoutePayload>;
  dropdownTollUsages: BaseState<DropdownTollUsages[]>;
  dropdownCustomerRoutes: {
    data: AllCustomerRouteDropdown[];
    options?: GetCustomerRouteDropdownPayload;
  };
  dropdownRouteActivityTypes: {
    data: AllCustomerRouteDropdown[];
    options?: GetAllCustomerRouteDropdownPayload;
  };
  dropdownLeadTimeTypes: {
    data: AllCustomerRouteDropdown[];
    options?: GetAllCustomerRouteDropdownPayload;
  };
  uploadQuotation: BaseState<UploadQuotation, UploadQuotationPayload>;
  downloadQuotation: BaseState<DownloadQuotationPayload>;
}

export interface DownloadQuotationPayload {
  id?: string;
  fileName?: string;
}

export interface UploadQuotationPayload {
  file?: any;
}

export interface UploadQuotation {
  quotationURL?: string;
}

export interface UploadQuotationResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: UploadQuotation;
  code?: string;
  eTag?: string;
}

export interface CreateCustomerRoutePayload {
  customerId?: string;
  contractId?: string;
  vehicleTypeId?: string;
  quotationURL?: string;
  routes?: {
    revenue?: number;
    leadtimeValue?: number;
    leadtimeType?: string;
    qtyDriver?: number;
    tollUsage?: number;
    details?: {
      routeActivityType?: string;
      customerLocationId?: string;
      order?: number;
    }[];
  }[];
}

export interface UpdateCustomerRoutePayload {
  id?: string;
  customerId?: string;
  contractId?: string;
  vehicleTypeId?: string;
  quotationURL?: string;
  routes?: {
    revenue?: number;
    leadtimeValue?: number;
    leadtimeType?: string;
    qtyDriver?: number;
    tollUsage?: number;
    details?: {
      id?: string;
      routeActivityType?: string;
      customerLocationId?: string;
      order?: number;
    }[];
  }[];
}

export interface DropdownTollUsages {
  id?: string;
  name?: string;
}

export interface GetDropdownTollUsagesResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: DropdownTollUsages[];
  code?: string;
  eTag?: string;
}

export interface DeleteCustomerRoutePayload {
  id?: string;
  options?: BaseType;
}

export interface DataDetailCustomerRoute {
  header?: {
    customerRouteId?: string;
    routeCode?: string;
    originalRouteCode?: string;
    customerId?: string;
    cmdCode?: string;
    customerName?: string;
    vehicleTypeId?: string;
    vehicleTypeName?: string;
    contractId?: string;
    contractNo?: string;
    quotationURL?: string;
    revenuePerShipment?: number;
    qtyDriver?: number;
    tollUsage?: number;
    cost?: number;
    leadtimeType?: string;
    leadtimeValue?: number;
    status?: string;
  };
  details?: {
    customerRouteDetailId?: string;
    routeActivityType?: string;
    routeOrder?: number;
    locationId?: string;
    locationName?: string;
    locationArea?: string;
    locationDetail?: string;
    locationCoordinate?: string;
    locationAddress?: string;
    locationProvinceId?: string;
    locationProvince?: string;
    locationCityId?: string;
    locationCity?: string;
    locationDistrictId?: string;
    locationDistrict?: string;
  }[];
}

export interface DetailCustomerRoutePayload {
  id?: string;
}

export interface CustomerRouteParams {
  category?: string[];
  industry?: string[];
  status?: string[];
}

export interface DataCustomerRoute {
  list?: CustomerRoute[];
  summary?: Summary;
}

export interface CustomerRoute extends BaseResponseData {
  no?: number;
  customerRouteId?: string;
  contractId?: string;
  routeCode?: string;
  originalRouteCode?: string;
  cmdCode?: string;
  customerName?: string;
  vehicleTypeName?: string;
  origin?: string;
  areaOrigin?: string;
  detailOrigin?: string;
  destination?: string;
  areaDestination?: string;
  detailDestination?: string;
  revenuePerShipment?: number;
  qtyDriver?: number;
  cost?: number;
  leadtimeType?: number;
  leadtimeValue?: number;
  shipmentType?: string;
  tollUsage?: number;
  tollUsageName?: string;
  expenseStatus?: boolean;
  jmpStatus?: boolean;
}

export interface Summary {
  totalCustomer?: number;
  totalRouteRegistered?: number;
}

export interface GetCustomerRoutesResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: DataCustomerRoute;
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface GetDetailCustomerRoutesResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: DataDetailCustomerRoute;
  code?: string;
  eTag?: string;
}

export interface AllCustomerRouteDropdown extends CustomerRoute {
  id?: string;
  name?: string;
}

export interface GetCustomerRouteDropdownPayload extends BaseType {
  search?: string;
  show?: string;
}

export interface GetAllCustomerRouteDropdownPayload {
  search?: string;
  searchBy?: string;
  sort?: string;
  order?: string;
}

export interface GetCustomerRouteDropdownResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: {
    list?: CustomerRoute[];
  };
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export const customerRouteTypes = {
  GET_CUSTOMER_ROUTES: "customerRoutes/getCustomerRoutes",
  GET_CUSTOMER_ROUTES_FETCH: "customerRoutes/getCustomerRoutesFetch",
  GET_CUSTOMER_ROUTES_SUCCESS: "customerRoutes/getCustomerRoutesSuccess",
  GET_CUSTOMER_ROUTES_FAILURE: "customerRoutes/getCustomerRoutesFailure",

  GET_CUSTOMER_ROUTES_AUTOCOMPLETE:
    "customerRoutes/getCustomerRoutesAutoComplete",
  GET_CUSTOMER_ROUTES_AUTOCOMPLETE_FETCH:
    "customerRoutes/getCustomerRoutesAutoCompleteFetch",
  GET_CUSTOMER_ROUTES_AUTOCOMPLETE_SUCCESS:
    "customerRoutes/getCustomerRoutesAutoCompleteSuccess",
  GET_CUSTOMER_ROUTES_AUTOCOMPLETE_FAILURE:
    "customerRoutes/getCustomerRoutesAutoCompleteFailure",

  CREATE_CUSTOMER_ROUTE: "customerRoutes/createCustomerRoute",
  CREATE_CUSTOMER_ROUTE_FETCH: "customerRoutes/createCustomerRouteFetch",
  CREATE_CUSTOMER_ROUTE_SUCCESS: "customerRoutes/createCustomerRouteSuccess",
  CREATE_CUSTOMER_ROUTE_FAILURE: "customerRoutes/createCustomerRouteFailure",

  GET_DETAIL_CUSTOMER_ROUTE: "customerRoutes/getDetailCustomerRoute",
  GET_DETAIL_CUSTOMER_ROUTE_FETCH: "customerRoutes/getDetailCustomerRouteFetch",
  GET_DETAIL_CUSTOMER_ROUTE_SUCCESS:
    "customerRoutes/getDetailCustomerRouteSuccess",
  GET_DETAIL_CUSTOMER_ROUTE_FAILURE:
    "customerRoutes/getDetailCustomerRouteFailure",

  UPDATE_CUSTOMER_ROUTE: "customerRoutes/updateCustomerRoute",
  UPDATE_CUSTOMER_ROUTE_FETCH: "customerRoutes/updateCustomerRouteFetch",
  UPDATE_CUSTOMER_ROUTE_SUCCESS: "customerRoutes/updateCustomerRouteSuccess",
  UPDATE_CUSTOMER_ROUTE_FAILURE: "customerRoutes/updateCustomerRouteFailure",

  DELETE_CUSTOMER_ROUTE: "customerRoutes/deleteCustomerRoute",
  DELETE_CUSTOMER_ROUTE_FETCH: "customerRoutes/deleteCustomerRouteFetch",
  DELETE_CUSTOMER_ROUTE_SUCCESS: "customerRoutes/deleteCustomerRouteSuccess",
  DELETE_CUSTOMER_ROUTE_FAILURE: "customerRoutes/deleteCustomerRouteFailure",

  GET_DROPDOWN_TOLL_USAGES: "customerRoutes/getDropdownTollUsages",
  GET_DROPDOWN_TOLL_USAGES_FETCH: "customerRoutes/getDropdownTollUsagesFetch",
  GET_DROPDOWN_TOLL_USAGES_SUCCESS:
    "customerRoutes/getDropdownTollUsagesSuccess",
  GET_DROPDOWN_TOLL_USAGES_FAILURE:
    "customerRoutes/getDropdownTollUsagesFailure",

  GET_DROPDOWN_CUSTOMER_ROUTES: "customerRoutes/getDropdownCustomerRoutes",
  GET_DROPDOWN_CUSTOMER_ROUTES_FETCH:
    "customerRoutes/getDropdownCustomerRoutesFetch",
  GET_DROPDOWN_CUSTOMER_ROUTES_SUCCESS:
    "customerRoutes/getDropdownCustomerRoutesSuccess",
  GET_DROPDOWN_CUSTOMER_ROUTES_FAILURE:
    "customerRoutes/getDropdownCustomerRoutesFailure",

  GET_DROPDOWN_ROUTE_ACTIVITY_TYPES:
    "customerRoutes/getDropdownRouteActivityTypes",
  GET_DROPDOWN_ROUTE_ACTIVITY_TYPES_FETCH:
    "customerRoutes/getDropdownRouteActivityTypesFetch",
  GET_DROPDOWN_ROUTE_ACTIVITY_TYPES_SUCCESS:
    "customerRoutes/getDropdownRouteActivityTypesSuccess",
  GET_DROPDOWN_ROUTE_ACTIVITY_TYPES_FAILURE:
    "customerRoutes/getDropdownRouteActivityTypesFailure",

  GET_DROPDOWN_LEAD_TIME_TYPES: "customerRoutes/getDropdownLeadTimeTypes",
  GET_DROPDOWN_LEAD_TIME_TYPES_FETCH:
    "customerRoutes/getDropdownLeadTimeTypesFetch",
  GET_DROPDOWN_LEAD_TIME_TYPES_SUCCESS:
    "customerRoutes/getDropdownLeadTimeTypesSuccess",
  GET_DROPDOWN_LEAD_TIME_TYPES_FAILURE:
    "customerRoutes/getDropdownLeadTimeTypesFailure",

  GET_CUSTOMER_ROUTES_AUTOCOMPLETE_CLEAR:
    "customerRoutes/getCustomerRoutesAutoCompleteClear",
  GET_CUSTOMER_ROUTE_DETAIL_CLEAR: "customerRoutes/getCustomerRouteDetailClear",
  UPDATE_CUSTOMER_ROUTE_CLEAR: "customerRoutes/updateCustomerRouteClear",

  UPLOAD_QUOTATION: "customerRoutes/uploadQuotation",
  UPLOAD_QUOTATION_FETCH: "customerRoutes/uploadQuotationFetch",
  UPLOAD_QUOTATION_SUCCESS: "customerRoutes/uploadQuotationSuccess",
  UPLOAD_QUOTATION_FAILURE: "customerRoutes/uploadQuotationFailure",

  DONWLOAD_QUOTATION: "customerRoutes/downloadQuotation",
  DONWLOAD_QUOTATION_FETCH: "customerRoutes/downloadQuotationFetch",
  DONWLOAD_QUOTATION_SUCCESS: "customerRoutes/downloadQuotationSuccess",
  DONWLOAD_QUOTATION_FAILURE: "customerRoutes/downloadQuotationFailure",
};
