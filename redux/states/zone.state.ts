import { ZoneState } from "@sera-types/zone.type";

const initialState: ZoneState = {
  isLoading: false,
  error: null,
  data: [],
  options: { page: 1, limit: 10 },
  zoneDetail: { data: null },
  dropdownZones: { data: [] },
};

export default initialState;
