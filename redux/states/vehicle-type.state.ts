import { VehicleTypeState } from "@sera-types/vehicle-type.type";

const initialState: VehicleTypeState = {
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
  vehicleTypeDetail: { data: {} },
  createNewVehicleType: { name: "" },
  updateVehicleType: { id: "", name: "" },
  deleteVehicleType: { id: "", name: "", options: { page: 0, limit: 0 } },
  dropdownVehicleTypes: { data: [] },
};

export default initialState;
