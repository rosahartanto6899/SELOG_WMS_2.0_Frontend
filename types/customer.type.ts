import {
  AutoCompleteType,
  BaseResponseData,
  BaseState,
  BaseType,
  PaginationType,
} from "./base.type";

export interface CustomerState extends BaseState<DataCustomer, CustomerParams> {
  autoComplete: BaseState<AutoCompleteType[]>;
  detailCustomer: BaseState<Customer, DetailCustomerPayload>;
  updateCustomer: BaseState<UpdateCustomerPayload>;
  createSales: BaseState<CreateSalesPayload>;
  deleteSales: BaseState<DeleteSalesPayload>;
  customerSales: BaseState<CustomerSales[], CustomerSalesPayload>;
  customerContacts: BaseState<CustomerContact[], CustomerContactsPayload>;

  dropdownCustomers: {
    data: AllCustomerDropdown[];
    options?: GetCustomerDropdownPayload;
  };
  dropdownSales: BaseState<DropdownSales[]>;
  dropdownAddReq: BaseState<DropdownAddReq[]>;
  dropdownPOD: BaseState<DropdownPOD[]>;
  dropdownCustomerIndustries: {
    data: AllCustomerDropdown[];
    options?: GetAllCustomerDropdownPayload;
  };
  dropdownCustomerCategories: {
    data: AllCustomerDropdown[];
    options?: GetAllCustomerDropdownPayload;
  };
  dropdownCustomerStatuses: {
    data: AllCustomerDropdown[];
    options?: GetAllCustomerDropdownPayload;
  };
}

export interface DataCustomer {
  list?: Customer[];
  summary?: Summary;
}

export interface Customer extends BaseResponseData {
  no?: number;
  id?: string;
  cmd?: string;
  name?: string;
  street?: string;
  city?: string;
  phone?: string;
  email?: string;
  industry?: string;
  category?: string;
  termOfPayment?: string;
  status?: string;
  isPhysicalPOD?: boolean;
  isEPOD?: boolean;
  hasSales?: boolean;
  additionalRequests?: string[];
}

export interface Summary {
  total?: number;
  active?: number;
  blocked?: number;
}

export interface CustomerSales extends BaseResponseData {
  no?: number;
  id?: string;
  branch?: CustomerSalesMaster;
  salesDealing?: CustomerSalesMaster;
  salesServicing?: CustomerSalesMaster;
}

export interface CustomerSalesMaster {
  id?: string;
  name?: string;
}

export interface CustomerContact extends BaseResponseData {
  no?: number;
  id?: string;
  name?: string;
  department?: string;
  phone?: string;
  mobilePhone?: string;
  email?: string;
}

export interface CustomerParams {
  category?: string[];
  industry?: string[];
  status?: string[];
}

export interface DetailCustomerPayload {
  id?: string;
}

export interface UpdateCustomerPayload {
  id?: string;
  isPhysicalPOD?: boolean;
  isEPOD?: boolean;
  additionalRequests?: [];
}

export interface CreateSalesPayload {
  customerId?: string;
  branchId?: string;
  salesDealing?: string;
  salesServicing?: string;
}

export interface DeleteSalesPayload {
  id?: string;
}

export interface CustomerSalesPayload {
  customerId?: string;
}

export interface CustomerContactsPayload {
  customerId?: string;
}

export interface DropdownSales {
  id?: string;
  name?: string;
  email?: string;
}

export interface DropdownAddReq {
  id?: string;
  name?: string;
}

export interface DropdownPOD {
  id?: string;
  name?: string;
}

export interface GetCustomersResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: DataCustomer;
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface GetDetailCustomerResponse {
  status?: boolean;
  message?: string;
  data?: Customer;
  code?: string;
  eTag?: string;
}

export interface GetCustomerSalesResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: CustomerSales[];
  code?: string;
  eTag?: string;
}

export interface GetCustomerContactsResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: CustomerContact[];
  code?: string;
  eTag?: string;
}

export interface GetDropdownSalesResponse {
  status?: boolean;
  message?: string;
  data?: DropdownSales[];
  code?: string;
  eTag?: string;
}

export interface GetDropdownAddReqResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: DropdownAddReq[];
  code?: string;
  eTag?: string;
}

export interface GetDropdownPODResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: DropdownPOD[];
  code?: string;
  eTag?: string;
}

export interface AllCustomerDropdown {
  id?: string;
  name?: string;
}

export interface GetCustomerDropdownPayload {
  search?: string;
  show?: string;
}

export interface GetAllCustomerDropdownPayload {
  search?: string;
  searchBy?: string;
  sort?: string;
  order?: string;
}

export interface GetCustomerDropdownResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: {
    id?: string;
    name?: string;
  }[];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export const customerTypes = {
  GET_CUSTOMERS: "customers/getCustomers",
  GET_CUSTOMERS_FETCH: "customers/getCustomersFetch",
  GET_CUSTOMERS_SUCCESS: "customers/getCustomersSuccess",
  GET_CUSTOMERS_FAILURE: "customers/getCustomersFailure",

  GET_CUSTOMERS_AUTOCOMPLETE: "customers/getCustomersAutoComplete",
  GET_CUSTOMERS_AUTOCOMPLETE_FETCH: "customers/getCustomersAutoCompleteFetch",
  GET_CUSTOMERS_AUTOCOMPLETE_SUCCESS:
    "customers/getCustomersAutoCompleteSuccess",
  GET_CUSTOMERS_AUTOCOMPLETE_FAILURE:
    "customers/getCustomersAutoCompleteFailure",

  GET_DETAIL_CUSTOMER: "customers/getDetailCustomer",
  GET_DETAIL_CUSTOMER_FETCH: "customers/getDetailCustomerFetch",
  GET_DETAIL_CUSTOMER_SUCCESS: "customers/getDetailCustomerSuccess",
  GET_DETAIL_CUSTOMER_FAILURE: "customers/getDetailCustomerFailure",

  CREATE_SALES: "customers/createSales",
  CREATE_SALES_FETCH: "customers/createSalesFetch",
  CREATE_SALES_SUCCESS: "customers/createSalesSuccess",
  CREATE_SALES_FAILURE: "customers/createSalesFailure",

  DELETE_SALES: "customers/deleteSales",
  DELETE_SALES_FETCH: "customers/deleteSalesFetch",
  DELETE_SALES_SUCCESS: "customers/deleteSalesSuccess",
  DELETE_SALES_FAILURE: "customers/deleteSalesFailure",

  GET_CUSTOMER_SALES: "customers/getCustomerSales",
  GET_CUSTOMER_SALES_FETCH: "customers/getCustomerSalesFetch",
  GET_CUSTOMER_SALES_SUCCESS: "customers/getCustomerSalesSuccess",
  GET_CUSTOMER_SALES_FAILURE: "customers/getCustomerSalesFailure",

  GET_CUSTOMER_CONTACTS: "customers/getCustomerContacts",
  GET_CUSTOMER_CONTACTS_FETCH: "customers/getCustomerContactsFetch",
  GET_CUSTOMER_CONTACTS_SUCCESS: "customers/getCustomerContactsSuccess",
  GET_CUSTOMER_CONTACTS_FAILURE: "customers/getCustomerContactsFailure",

  UPDATE_CUSTOMER: "customers/updateCustomer",
  UPDATE_CUSTOMER_FETCH: "customers/updateCustomerFetch",
  UPDATE_CUSTOMER_SUCCESS: "customers/updateCustomerSuccess",
  UPDATE_CUSTOMER_FAILURE: "customers/updateCustomerFailure",

  GET_DROPDOWN_SALES: "customers/getDropdownSales",
  GET_DROPDOWN_SALES_FETCH: "customers/getDropdownSalesFetch",
  GET_DROPDOWN_SALES_SUCCESS: "customers/getDropdownSalesSuccess",
  GET_DROPDOWN_SALES_FAILURE: "customers/getDropdownSalesFailure",

  GET_DROPDOWN_ADD_REQ: "customers/getDropdownAddReq",
  GET_DROPDOWN_ADD_REQ_FETCH: "customers/getDropdownAddReqFetch",
  GET_DROPDOWN_ADD_REQ_SUCCESS: "customers/getDropdownAddReqSuccess",
  GET_DROPDOWN_ADD_REQ_FAILURE: "customers/getDropdownAddReqFailure",

  GET_DROPDOWN_POD: "customers/getDropdownPOD",
  GET_DROPDOWN_POD_FETCH: "customers/getDropdownPODFetch",
  GET_DROPDOWN_POD_SUCCESS: "customers/getDropdownPODSuccess",
  GET_DROPDOWN_POD_FAILURE: "customers/getDropdownPODFailure",

  GET_DROPDOWN_CUSTOMERS: "customers/getDropdownCustomers",
  GET_DROPDOWN_CUSTOMERS_FETCH: "customers/getDropdownCustomersFetch",
  GET_DROPDOWN_CUSTOMERS_SUCCESS: "customers/getDropdownCustomersSuccess",
  GET_DROPDOWN_CUSTOMERS_FAILURE: "customers/getDropdownCustomersFailure",

  GET_DROPDOWN_CUSTOMER_INDUSTRIES: "customers/getDropdownCustomerIndustries",
  GET_DROPDOWN_CUSTOMER_INDUSTRIES_FETCH:
    "customers/getDropdownCustomerIndustriesFetch",
  GET_DROPDOWN_CUSTOMER_INDUSTRIES_SUCCESS:
    "customers/getDropdownCustomerIndustriesSuccess",
  GET_DROPDOWN_CUSTOMER_INDUSTRIES_FAILURE:
    "customers/getDropdownCustomerIndustriesFailure",

  GET_DROPDOWN_CUSTOMER_CATEGORIES: "customers/getDropdownCustomerCategories",
  GET_DROPDOWN_CUSTOMER_CATEGORIES_FETCH:
    "customers/getDropdownCustomerCategoriesFetch",
  GET_DROPDOWN_CUSTOMER_CATEGORIES_SUCCESS:
    "customers/getDropdownCustomerCategoriesSuccess",
  GET_DROPDOWN_CUSTOMER_CATEGORIES_FAILURE:
    "customers/getDropdownCustomerCategoriesFailure",

  GET_DROPDOWN_CUSTOMER_STATUSES: "customers/getDropdownCustomerStatuses",
  GET_DROPDOWN_CUSTOMER_STATUSES_FETCH:
    "customers/getDropdownCustomerStatusesFetch",
  GET_DROPDOWN_CUSTOMER_STATUSES_SUCCESS:
    "customers/getDropdownCustomerStatusesSuccess",
  GET_DROPDOWN_CUSTOMER_STATUSES_FAILURE:
    "customers/getDropdownCustomerStatusesFailure",

  GET_CUSTOMERS_AUTOCOMPLETE_CLEAR: "customers/getCustomersAutoCompleteClear",
  GET_CUSTOMER_DETAIL_CLEAR: "customers/getCustomerDetailClear",
  UPDATE_CUSTOMER_CLEAR: "customers/updateCustomerClear",
};
