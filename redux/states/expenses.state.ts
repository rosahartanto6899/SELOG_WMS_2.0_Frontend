import { ExpensesState } from "@sera-types/expenses.type";

const initialState: ExpensesState = {
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
  detailExpenses: {
    isLoading: false,
    error: null,
    data: {},
  },
  updateExpenses: {
    isLoading: false,
    error: null,
    data: {},
  },
  createExpenses: {
    isLoading: false,
    error: null,
    data: {},
  },
  summaryExpenses: {
    isLoading: false,
    error: null,
    data: {
      summary: {
        total: 0,
        completed: 0,
        incompleted: 0,
      },
    },
  },
  downloadExpensesTemplate: {
    isLoading: false,
    error: null,
    data: null,
  },
};

export default initialState;
