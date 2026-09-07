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
};

export default initialState;
