import { ActualOutgoingState } from "@sera-types/actual-outgoing.type";

const initialState: ActualOutgoingState = {
  isLoading: false,
  error: null,
  data: [],
  options: { page: 1, limit: 10 },
  recordsTotal: 0,
};

export default initialState;
