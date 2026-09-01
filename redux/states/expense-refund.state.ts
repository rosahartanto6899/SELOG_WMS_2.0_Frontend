import { ExpenseRefundState } from "@sera-types/expense-refund.type";
import {
  DEFAULT_STATE,
  DEFAULT_STATE_OPTIONS,
} from "@sera-utils/constants/common";

const initialState: ExpenseRefundState = {
  getSummary: DEFAULT_STATE({}),
  getList: DEFAULT_STATE_OPTIONS([]),
  refundProcess: DEFAULT_STATE({}),
  getDetails: DEFAULT_STATE({}),
};

export default initialState;
