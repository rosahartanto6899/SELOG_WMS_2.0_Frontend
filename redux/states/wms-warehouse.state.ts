import { WmsWarehouseState } from "@sera-types/customer.type";

const initialState: WmsWarehouseState = {
  data: [],
  isLoading: false,
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
  warehouseDetail: {
    data: {},
  },
  createWarehouse: {
    data: [],
  },
  updateWarehouse: {
    data: [],
  },
  dropdownWarehouses: {
    data: [],
  },
  postCreateWarehouse: { code: "", name: "" },
  postUpdateWarehouse: { id: "", name: "" },
  postDeleteWarehouse: { id: "", name: "" },
};

export default initialState;
