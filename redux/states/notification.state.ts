import { NotificationState } from "../../types/notification.type";

const initialState: NotificationState = {
  data: [],
  count: 0,
  saveState: false,
  autoComplete: null,
  options: {
    page: 1,
    limit: 10,
    totalData: 0,
    totalPage: 0,
    order: null,
    sort: null,
    searchBy: null,
    search: null,
    hasMore: false,
  },
  error: null,
  fleetGroups: {
    data: [],
  },
  isLoading: false,
};

export default initialState;
