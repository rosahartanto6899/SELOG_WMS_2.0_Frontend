import { AdditionalExpenseState } from "@sera-types/additional-expense.type";

const initialState: AdditionalExpenseState = {
  isLoading: false,
  error: null,
  data: [],
  options: {
    page: 1,
    limit: 10,
    totalData: 0,
    totalPage: 0,
    order: null,
    sort: null,
    searchBy: null,
    search: null,
  },
  autoComplete: {
    isLoading: false,
    error: null,
    data: [],
    options: {
      page: 1,
      limit: 10,
      totalData: 0,
      totalPage: 0,
      order: null,
      sort: null,
      searchBy: null,
      search: null,
    },
  },
  summary: {
    isLoading: false,
    error: null,
    data: {
      waitingForApproval: 0,
      approved: 0,
      rejected: 0,
      open: 0,
      total: 0,
    },
    payload: {},
  },
  detail: {
    isLoading: false,
    error: null,
    data: {},
    payload: { id: "" },
  },
  expenseDetail: {
    isLoading: false,
    error: null,
    data: [],
    payload: { id: "" },
  },
  auditTrail: {
    isLoading: false,
    error: null,
    data: [],
    payload: { id: "" },
  },
  updateApproval: {
    isLoading: false,
    error: null,
    data: {
      referenceId: "",
      type: "approve",
    },
  },
};

export default initialState;
