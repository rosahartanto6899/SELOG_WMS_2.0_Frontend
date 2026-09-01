import { CityState } from "@sera-types/cities.type";

const initialState: CityState = {
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
  dropdownCities: {
    data: [],
  },
};

export default initialState;
