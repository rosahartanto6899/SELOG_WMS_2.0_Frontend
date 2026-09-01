import { ExpenseState } from "@sera-types/expense-monitoring";
import {
  DEFAULT_STATE,
  DEFAULT_STATE_OPTIONS,
} from "@sera-utils/constants/common";

const initialState: ExpenseState = {
  getSummary: DEFAULT_STATE({}),
  getSummaryExpenses: DEFAULT_STATE([]),
  getShipmentExpenses: DEFAULT_STATE_OPTIONS([]),
  getACShipmentExpenses: DEFAULT_STATE_OPTIONS([]),
  updateTermin1Date: DEFAULT_STATE({}),
  getDetailExpenses: DEFAULT_STATE([]),
  updateDetailExpense: DEFAULT_STATE({}),
  getAuditTrail: DEFAULT_STATE([]),
  getAddExpenses: DEFAULT_STATE_OPTIONS([]),
  createAddExpenses: DEFAULT_STATE({}),
};

export default initialState;
