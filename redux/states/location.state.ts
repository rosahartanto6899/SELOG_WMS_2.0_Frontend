import { LocationState } from "@sera-types/location.type";

const initialState: LocationState = {
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
  autoComplete: {
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
    data: [],
  },
  dropdownLocations: {
    isSuccess: false,
    data: [],
    payload: {},
  },
  createNewLocation: {
    data: [],
  },
  locationDetail: {
    data: {},
  },
  updateLocation: {
    data: [],
  },
  postCreateNewLocation: {
    code: "",
    name: "",
    address: "",
    type: "",
    province: "",
    area: "",
    coordinate: "",
  },
  postUpdateLocation: {
    id: "",
    code: "",
    name: "",
    address: "",
    type: "",
    province: "",
    area: "",
    coordinate: "",
  },
  postDeleteLocation: { id: "", name: "" },
};

export default initialState;
