import { OutstandingIncomingState } from "@sera-types/outstanding-incoming.type";

const initialState: OutstandingIncomingState = {
  isLoading: false,
  error: null,
  data: [],
  options: { page: 1, limit: 10 },
  recordsTotal: 0,
  summary: {
    isLoading: false,
    error: null,
    payload: null,
    data: { total: 0, byWarehouse: [] },
  },
  detail: {
    isLoading: false,
    error: null,
    data: null,
    history: [],
  },
};

export default initialState;
