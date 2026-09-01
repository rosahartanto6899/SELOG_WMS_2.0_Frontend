import { VehicleGroupState } from "@sera-types/vehicle-group.type";

const initialState: VehicleGroupState = {
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
  dropdownVehicleGroups: {
    data: [],
  },
};

export default initialState;
