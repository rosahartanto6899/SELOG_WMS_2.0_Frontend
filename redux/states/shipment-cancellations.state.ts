import { ShipmentCancellationsState } from "@sera-types/shipment-cancellations.type";

const initialState: ShipmentCancellationsState = {
  isLoading: false,
  error: null,
  data: [],
  approvalHistory: {
    data: [],
    isLoading: false,
    error: null,
  },

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
  updateApprovalReroute: {
    isLoading: false,
    error: null,
    data: {
      action: "approve",
      note: "",
      id: "",
    },
  },
  updateApprovalCancel: {
    isLoading: false,
    error: null,
    data: {
      action: "approve",
      note: "",
      id: "",
    },
  },
  updateApprovalReschedule: {
    isLoading: false,
    error: null,
    data: {
      action: "approve",
      note: "",
      id: "",
    },
  },
};

export default initialState;
