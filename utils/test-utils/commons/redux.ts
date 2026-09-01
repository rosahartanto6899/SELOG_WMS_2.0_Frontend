import { MOCK_DATA_OPTIONS } from ".";

export const MOCK_REDUX_ALERT = {
  autoComplete: MOCK_DATA_OPTIONS,
  dropdownAlert: {
    data: [],
  },
};

export const MOCK_REDUX_ALERT_HISTORY = {
  data: [],
  autoComplete: MOCK_DATA_OPTIONS,
  autoCompleteVerifiedBy: MOCK_DATA_OPTIONS,
  alertHistoryDetail: {
    data: {},
  },
  alertHistoryReconstruction: {
    data: [],
  },
};

export const MOCK_REDUX_FLEET_GROUPS = {
  createNewFleetGroup: {
    data: [],
  },
  dataSummary: MOCK_DATA_OPTIONS,
  autoComplete: MOCK_DATA_OPTIONS,
  autoCompleteSummary: MOCK_DATA_OPTIONS,
  dropdownFleetGroups: MOCK_DATA_OPTIONS,
  dropdownFleetGroupsByMWMapping: MOCK_DATA_OPTIONS,
  dropdownMultiFleetGroups: MOCK_DATA_OPTIONS,
  fleetGroupDetail: {
    data: {},
  },
  updateFleetGroup: {
    data: [],
  },
};

export const MOCK_REDUX = {
  alert,
  fleetGroup: {},
};

export const MOCK_USE_ROUTER = {
  events: {
    off: jest.fn(),
    on: jest.fn(),
  },
  query: {
    id: "1",
    token: "",
  },
  pathname: "/",
  push: () => console.log("router-push"),
};

export const MOCK_USE_SESSION = {
  data: {
    detail: {
      data: { user: { fleetGroup: "", isInternal: true, name: "" } },
    },
    user: { name: "" },
  },
};
