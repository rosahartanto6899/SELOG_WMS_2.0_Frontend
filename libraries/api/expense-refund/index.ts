import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import {
  ExpenseRefundProcessPayload,
  PayloadDetails,
  UnitParams,
} from "@sera-types/expense-refund.type";

const expenseRefundApi = () => {
  const baseUrlPath = "expense-refunds";
  async function getSummary(_payload?: UnitParams) {
    return httpService
      .get(`${apiUrl.billing}/${baseUrlPath}/summary`, {
        params: _payload,
      })
      .then((_resp) => _resp);
  }

  async function getList(_payload?: BaseType) {
    return httpService
      .get(`${apiUrl.billing}/${baseUrlPath}`, {
        params: _payload,
      })
      .then((_resp) => _resp);
  }

  async function refundProcess(
    { id, ..._payload }: ExpenseRefundProcessPayload,
    callback?: () => void,
  ) {
    return httpService
      .put(`${apiUrl.billing}/${baseUrlPath}/process/${id}`, {
        ..._payload,
      })
      .then((_resp) => {
        if (callback) callback();
        return _resp;
      });
  }

  async function getDetails({ id }: PayloadDetails) {
    const url = `${apiUrl.billing}/${baseUrlPath}/${id}`;
    return httpService.get(url).then((e) => e);
  }

  return {
    getSummary,
    getList,
    refundProcess,
    getDetails,
  };
};

export default expenseRefundApi;
