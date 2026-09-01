import { AutoCompleteType, BaseType, PaginationType } from "./base.type";

export interface CompaniesAutoComplete {
  options: BaseType;
  data: AutoCompleteType[] | [];
}

export interface CompanyState {
  isLoading?: boolean;
  error?: Error | string | null;
  data: Company[];
  options?: BaseType;
  autoComplete: CompaniesAutoComplete;
  companyDetail: { data: Company };
  createNewCompany: CreateNewCompanyPayload;
  updateCompany: UpdateCompanyPayload;
  deleteCompany: DeleteCompanyPayload;
  dropdownCompanies: {
    data: CompanyDropdown[];
    options?: GetCompanyDropdownPayload;
  };
}

export interface Company {
  no?: number;
  code?: string;
  name?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CompanyDropdown {
  id?: string;
  code?: string;
  name?: string;
}

export interface GetCompanyDropdownPayload {
  search?: string;
}

export interface CreateNewCompanyPayload {
  code?: string;
  name?: string;
}

export interface UpdateCompanyPayload {
  id?: string;
  code?: string;
  name?: string;
}
export interface DeleteCompanyPayload {
  id?: string;
  name?: string;
  options?: BaseType;
}

export interface GetCompaniesResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: Company[] | [];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export const companyTypes = {
  GET_COMPANIES: "companies/getCompanies",
  GET_COMPANIES_FETCH: "companies/getCompaniesFetch",
  GET_COMPANIES_SUCCESS: "companies/getCompaniesSuccess",
  GET_COMPANIES_FAILURE: "companies/getCompaniesFailure",

  GET_COMPANIES_AUTOCOMPLETE: "companies/getCompaniesAutoComplete",
  GET_COMPANIES_AUTOCOMPLETE_FETCH: "companies/getCompaniesAutoCompleteFetch",
  GET_COMPANIES_AUTOCOMPLETE_SUCCESS:
    "companies/getCompaniesAutoCompleteSuccess",
  GET_COMPANIES_AUTOCOMPLETE_FAILURE:
    "companies/getCompaniesAutoCompleteFailure",

  GET_COMPANY_DETAIL: "companies/getCompanyDetail",
  GET_COMPANY_DETAIL_FETCH: "companies/getCompanyDetailFetch",
  GET_COMPANY_DETAIL_SUCCESS: "companies/getCompanyDetailSuccess",
  GET_COMPANY_DETAIL_FAILURE: "companies/getCompanyDetailFailure",

  CREATE_COMPANY: "companies/createNewCompany",
  CREATE_COMPANY_FETCH: "companies/createNewCompanyFetch",
  CREATE_COMPANY_SUCCESS: "companies/createNewCompanysuccess",
  CREATE_COMPANY_FAILURE: "companies/createNewCompanyFailure",

  UPDATE_COMPANY: "companies/updateCompany",
  UPDATE_COMPANY_FETCH: "companies/updateCompanyFetch",
  UPDATE_COMPANY_SUCCESS: "companies/updateCompanySuccess",
  UPDATE_COMPANY_FAILURE: "companies/updateCompanyFailure",

  DELETE_COMPANY: "companies/deleteCompany",
  DELETE_COMPANY_FETCH: "companies/deleteCompanyFetch",
  DELETE_COMPANY_SUCCESS: "companies/deleteCompanySuccess",
  DELETE_COMPANY_FAILURE: "companies/deleteCompanyFailure",

  GET_DROPDOWN_COMPANIES: "companies/getDropdownCompanies",
  GET_DROPDOWN_COMPANIES_FETCH: "companies/getDropdownCompaniesFetch",
  GET_DROPDOWN_COMPANIES_SUCCESS: "companies/getDropdownCompaniesSuccess",
  GET_DROPDOWN_COMPANIES_FAILURE: "companies/getDropdownCompaniesFailure",
};
