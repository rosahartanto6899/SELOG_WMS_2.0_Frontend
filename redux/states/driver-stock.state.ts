import { IDriverStockState } from "@sera-types/driver-stock.type";

const initialState: IDriverStockState = {
  getSummary: {
    isLoading: false,
    error: null,
    data: {
      driverData: {
        driverBranches: [],
        driverTotal: {
          pkwt: 0,
          mitra: 0,
          total: 0,
        },
      },
      driverInOutData: [],
    },
    payload: {
      "branchId[]": [],
      "shipmentType[]": [],
    },
  },
  options: {
    page: 1,
    limit: 10,
  },
  data: [],
  getFilterOption: {
    data: [],
  },
  getDetails: {
    data: {
      id: "",
      employeeId: "",
      employeeName: "",
      employeeStatus: "",
      vkvd: "",
      branchId: "",
      shipmentType: "",
      startDate: "",
      endDate: "",
      joinDate: "",
      birthPlace: "",
      birthDate: "",
      mobilePhone: "",
      email: "",
      citizenIdAddress: "",
      licenseNumber: "",
      licenseType: "",
      licenseExpired: "",
      bankAccount: "",
      bankAccountHolder: "",
      capacityStatus: "",
      isAllotment: false,
      isActiveWaha: false,
      createdBy: "",
      updatedBy: "",
      createdAt: "",
      updatedAt: "",
      abilityAreas: [],
      abilityUnits: [],
      trainings: [],
      contractStatus: "",
      branchName: "",
      licenseStatus: "",
      historical: {
        fatigueStatus: "",
      },
    },
  },
  updateNote: { data: null, error: null, isLoading: false },
};

export default initialState;
