import { LocationTypeState } from "@sera-types/location-type.type";

const initialState: LocationTypeState = {
  data: [],
  isLoading: false,
  saveState: false,
  error: null,
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
  dropdownLocationTypes: {
    data: [],
  },
};

export default initialState;
