import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  CreateNewCompanyPayload,
  GetCompanyDropdownPayload,
  UpdateCompanyPayload,
} from "@sera-types/company.type";

const CompanyApi = () => {
  async function retrieveCompanies(payload: BaseType) {
    return httpService
      .get(`${apiUrl.master}/companies`, { params: payload })
      .then((resp) => resp);
  }

  async function retrieveCompanyDetail(payload: { id: string }) {
    return httpService
      .get(`${apiUrl.master}/companies/${payload.id}`)
      .then((resp) => resp);
  }

  async function createCompany(payload: CreateNewCompanyPayload) {
    return httpService
      .post(`${apiUrl.master}/companies`, payload)
      .then((resp) => resp);
  }

  async function updateCompany(payload: {
    code: string;
    items?: UpdateCompanyPayload;
  }) {
    return httpService
      .put(`${apiUrl.master}/companies/${payload.code}`, payload.items)
      .then((resp) => resp);
  }

  async function deleteCompany(id: string) {
    return httpService
      .del(`${apiUrl.master}/companies/${id}`)
      .then((resp) => resp);
  }

  async function retrieveDropdownCompanies(params: GetCompanyDropdownPayload) {
    const keys = Object.keys(params);
    const PARAMS = Object.entries(params)
      .filter((e) => e[1])
      .map((val) => val.join("="))
      .join("&");
    return httpService
      .get(
        `${apiUrl.master}/companies/dropdown${keys.length ? "?" + PARAMS : ""}`,
      )
      .then((resp) => resp);
  }

  return {
    retrieveCompanies,
    retrieveCompanyDetail,
    createCompany,
    updateCompany,
    deleteCompany,
    retrieveDropdownCompanies,
  };
};

export default CompanyApi;
