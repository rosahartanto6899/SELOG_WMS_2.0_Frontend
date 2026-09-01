import { OrderStatusState } from "@sera-types/order-status.type";

const initialState: OrderStatusState = {
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
      summary: {
        administrationProcess: 0,
        pairingProcess: 0,
        shipmentDone: 0,
        shipmentJourney: 0,
        totalShipment: 0,
        shipmentOrder: 0,
      },
      shipmentStatus: [],
    },
  },
  detail: {
    isLoading: false,
    error: null,
    data: {},
  },
  updateReroute: {
    isLoading: false,
    error: null,
    data: {
      shipmentId: "",
      customerRouteId: "",
      reason: "",
    },
  },
  updateCancel: {
    isLoading: false,
    error: null,
    data: {
      shipmentId: "",
      cancellationReason: "",
      chronology: "",
    },
  },
  updateReschedule: {
    isLoading: false,
    error: null,
    data: {
      shipmentId: "",
      pickupDate: "",
      reason: "",
    },
  },
};

export default initialState;
