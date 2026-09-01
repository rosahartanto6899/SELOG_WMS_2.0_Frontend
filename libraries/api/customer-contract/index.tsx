import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  DetailContractPayload,
  GetCustomerContractDropdownPayload,
  UpdateCustomerContractPayload,
} from "@sera-types/customer-contract.type";
import _ from "lodash";

const CustomerContractApi = () => {
  async function getContracts(payload: BaseType & { customerId?: string }) {
    return httpService
      .get(`${apiUrl.order}/customer-contracts`, { params: payload })
      .then((resp) => resp);
  }

  async function getDetailContract(payload: DetailContractPayload) {
    return httpService
      .get(`${apiUrl.order}/customer-contracts/${payload.id}`)
      .then((resp) => resp);
  }

  async function updateCustomerContract(payload: {
    id: string;
    items?: UpdateCustomerContractPayload;
  }) {
    const data = _.omit(payload.items, "name");
    return httpService
      .put(`${apiUrl.order}/customer-contracts/${payload.id}`, data)
      .then((resp) => resp);
  }

  async function deleteCustomerContract(id: string) {
    return httpService
      .del(`${apiUrl.order}/customer-contracts/${id}`)
      .then((resp) => resp);
  }

  async function retrieveDropdownCustomerContracts(
    params: GetCustomerContractDropdownPayload,
  ) {
    const keys = Object.keys(params);
    const PARAMS = Object.entries(params)
      .filter((e) => e[1])
      .map((val) => val.join("="))
      .join("&");
    return httpService
      .get(
        `${apiUrl.order}/customer-contracts${keys.length ? "?" + PARAMS : ""}`,
      )
      .then((resp) => resp);
  }

  return {
    getContracts,
    getDetailContract,
    updateCustomerContract,
    deleteCustomerContract,
    retrieveDropdownCustomerContracts,
  };
};

export default CustomerContractApi;
