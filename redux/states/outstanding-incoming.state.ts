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
    data: { carryOver: 0, today: 0, planned: 0, hold: 0 },
  },
  detail: {
    isLoading: false,
    error: null,
    data: null,
    history: [],
  },
};

export default initialState;
