import { LocationState } from "@sera-types/location.type";

const initialState: LocationState = {
  isLoading: false,
  error: null,
  data: [],
  options: { page: 1, limit: 10 },
  locationDetail: { data: null },
  dropdownLocations: { data: [] },
};

export default initialState;
