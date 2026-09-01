import { ApprovalBookingOrderState } from "@sera-types/approval-booking-order.type";

const initialState: ApprovalBookingOrderState = {
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
  summary: {
    isLoading: false,
    error: null,
    data: {
      totalConfirmed: 0,
      totalRejected: 0,
      totalOrder: 0,
      totalRequested: 0,
      totalCancelled: 0,
    },
  },
  detailApprovalBooking: {
    isLoading: false,
    error: null,
    data: {},
  },
  updateApprovalBooking: {
    isLoading: false,
    error: null,
    data: {},
  },
  confirmationStatus: {
    isLoading: false,
    error: null,
    data: [],
  },
};

export default initialState;
