import { ActualIncomingState } from "@sera-types/actual-incoming.type";

const initialState: ActualIncomingState = {
  isLoading: false,
  error: null,
  data: [],
  options: { page: 1, limit: 10 },
  recordsTotal: 0,
};

export default initialState;
