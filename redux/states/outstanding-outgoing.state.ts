import { OutstandingOutgoingState } from "@sera-types/outstanding-outgoing.type";

const initialState: OutstandingOutgoingState = {
  submit: {
    isLoading: false,
    error: null,
    success: false,
    message: null,
  },
  edit: {
    isLoading: false,
    error: null,
    data: null,
  },
  detail: {
    isLoading: false,
    error: null,
    data: null,
    history: [],
  },
  list: {
    isLoading: false,
    error: null,
    data: [],
    options: { page: 1, limit: 10 },
    recordsTotal: 0,
  },
  items: { isLoading: false, error: null, data: [] },
  packagings: { isLoading: false, error: null, data: [] },
  shipments: { isLoading: false, error: null, data: [] },
  totals: {
    isLoading: false,
    error: null,
    payload: null,
    data: { total: 0, byWarehouse: [] },
  },
};

export default initialState;
