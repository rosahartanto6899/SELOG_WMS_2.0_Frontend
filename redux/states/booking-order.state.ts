import { BookingOrderState } from "@sera-types/booking-order.type";

const initialState: BookingOrderState = {
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
    },
  },
  detailBooking: {
    isLoading: false,
    error: null,
    data: {},
  },
  createBooking: {
    isLoading: false,
    error: null,
    data: {},
  },
  updateBooking: {
    isLoading: false,
    error: null,
    data: {},
  },
  updateStatusBooking: {
    isLoading: false,
    error: null,
    data: {
      id: "",
      status: "",
    },
  },
  dropdownAdditionalRequestItems: {
    isLoading: false,
    error: null,
    data: [],
  },
};

export default initialState;
