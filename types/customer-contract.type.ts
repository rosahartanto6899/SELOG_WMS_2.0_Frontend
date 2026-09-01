import {
  AutoCompleteType,
  BaseResponseData,
  BaseState,
  BaseType,
  PaginationType,
} from "./base.type";

export interface CustomerContractState extends BaseState<Contract[]> {
  autoComplete: BaseState<AutoCompleteType[]>;
  detailContract: BaseState<Contract, DetailContractPayload>;

  updateCustomerContract: UpdateCustomerContractPayload;
  dropdownCustomerContracts: {
    data: AllCustomerContractDropdown[];
    options?: GetCustomerContractDropdownPayload;
  };
  dropdownRouteActivityTypes: {
    data: AllCustomerContractDropdown[];
    options?: GetAllCustomerContractDropdownPayload;
  };
  dropdownLeadTimeTypes: {
    data: AllCustomerContractDropdown[];
    options?: GetAllCustomerContractDropdownPayload;
  };
}

export interface DetailContractPayload {
  id?: string;
}

export interface GetDetailContractsResponse {
  status?: boolean;
  message?: string;
  data?: Contract;
  code?: string;
  eTag?: string;
}

export interface CustomerContractMaterials {
  createdBy?: string;
  createdDate?: string;
  materialCode?: string;
  materialName?: string;
  salesOffice?: string;
  shipmentType?: string;
  validFromDate?: string;
  validToDate?: string;
  vehicleTypeId?: string;
  vehicleTypeName?: string;
}

export interface Contract extends BaseResponseData {
  no?: number;
  id?: string;
  cmd?: string;
  contractNo?: string;
  createdBy?: string;
  createdDate?: string;
  endDate?: string;
  name?: string;
  quotationSalesDocument?: string;
  quotationValidFromDate?: string;
  quotationValidToDate?: string;
  quotationCreatedDate?: string;
  quotationCreatedOn?: string;
  quotationCreatedBy?: string;
  materials?: CustomerContractMaterials[];
  startDate?: string;
}

export interface GetContractsResponse {
  status?: boolean;
  message?: string;
  data?: Contract[];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface AllCustomerContractDropdown {
  id?: string;
  name?: string;
}

export interface GetCustomerContractDropdownPayload {
  search?: string;
  show?: string;
}

export interface GetAllCustomerContractDropdownPayload {
  search?: string;
  searchBy?: string;
  sort?: string;
  order?: string;
}

export interface UpdateCustomerContractPayload {
  id?: string;
  name?: string;
  city?: string;
  street?: string;
  phone?: string;
  email?: string;
  industry?: string;
  category?: string;
  status?: string;
}

export interface GetCustomerContractDropdownResponse extends BaseType {
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

export const customerContractTypes = {
  GET_CONTRACTS: "customerContracts/getContracts",
  GET_CONTRACTS_FETCH: "customerContracts/getContractsFetch",
  GET_CONTRACTS_SUCCESS: "customerContracts/getContractsSuccess",
  GET_CONTRACTS_FAILURE: "customerContracts/getContractsFailure",

  GET_CONTRACTS_AUTOCOMPLETE: "customerContracts/getContractsAutoComplete",
  GET_CONTRACTS_AUTOCOMPLETE_FETCH:
    "customerContracts/getContractsAutoCompleteFetch",
  GET_CONTRACTS_AUTOCOMPLETE_SUCCESS:
    "customerContracts/getContractsAutoCompleteSuccess",
  GET_CONTRACTS_AUTOCOMPLETE_FAILURE:
    "customerContracts/getContractsAutoCompleteFailure",

  GET_DETAIL_CONTRACT: "customerContracts/getDetailContract",
  GET_DETAIL_CONTRACT_FETCH: "customerContracts/getDetailContractFetch",
  GET_DETAIL_CONTRACT_SUCCESS: "customerContracts/getDetailContractSuccess",
  GET_DETAIL_CONTRACT_FAILURE: "customerContracts/getDetailContractFailure",

  UPDATE_CUSTOMER_CONTRACT: "customerRoutes/updateCustomerContract",
  UPDATE_CUSTOMER_CONTRACT_FETCH: "customerRoutes/updateCustomerContractFetch",
  UPDATE_CUSTOMER_CONTRACT_SUCCESS:
    "customerRoutes/updateCustomerContractSuccess",
  UPDATE_CUSTOMER_CONTRACT_FAILURE:
    "customerRoutes/updateCustomerContractFailure",

  GET_DROPDOWN_CUSTOMER_CONTRACTS:
    "customerContracts/getDropdownCustomerContracts",
  GET_DROPDOWN_CUSTOMER_CONTRACTS_FETCH:
    "customerContracts/getDropdownCustomerContractsFetch",
  GET_DROPDOWN_CUSTOMER_CONTRACTS_SUCCESS:
    "customerContracts/getDropdownCustomerContractsSuccess",
  GET_DROPDOWN_CUSTOMER_CONTRACTS_FAILURE:
    "customerContracts/getDropdownCustomerContractsFailure",

  GET_DROPDOWN_CONTRACT_ACTIVITY_TYPES:
    "customerRoutes/getDropdownRouteActivityTypes",
  GET_DROPDOWN_CONTRACT_ACTIVITY_TYPES_FETCH:
    "customerRoutes/getDropdownRouteActivityTypesFetch",
  GET_DROPDOWN_CONTRACT_ACTIVITY_TYPES_SUCCESS:
    "customerRoutes/getDropdownRouteActivityTypesSuccess",
  GET_DROPDOWN_CONTRACT_ACTIVITY_TYPES_FAILURE:
    "customerRoutes/getDropdownRouteActivityTypesFailure",

  GET_DROPDOWN_LEAD_TIME_TYPES: "customerRoutes/getDropdownLeadTimeTypes",
  GET_DROPDOWN_LEAD_TIME_TYPES_FETCH:
    "customerRoutes/getDropdownLeadTimeTypesFetch",
  GET_DROPDOWN_LEAD_TIME_TYPES_SUCCESS:
    "customerRoutes/getDropdownLeadTimeTypesSuccess",
  GET_DROPDOWN_LEAD_TIME_TYPES_FAILURE:
    "customerRoutes/getDropdownLeadTimeTypesFailure",

  GET_CUSTOMER_CONTRACTS_AUTOCOMPLETE_CLEAR:
    "customerRoutes/getContractsAutoCompleteClear",
  GET_CUSTOMER_CONTRACT_DETAIL_CLEAR:
    "customerRoutes/getCustomerContractDetailClear",
  UPDATE_CUSTOMER_CONTRACT_CLEAR: "customerRoutes/updateCustomerContractClear",
};
