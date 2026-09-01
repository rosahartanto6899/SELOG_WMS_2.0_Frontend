import { MasterDataState } from "@sera-types/master-data.type";
import { DEFAULT_STATE } from "@sera-utils/constants/common";

const initialState: MasterDataState = {
  getAreas: DEFAULT_STATE([]),
  getOrderPriorities: DEFAULT_STATE([]),
  getUnitCapacityStatuses: DEFAULT_STATE([]),
  getDriverCapacityStatuses: DEFAULT_STATE([]),
  getEmployeeStatuses: DEFAULT_STATE([]),
  getTierLevels: DEFAULT_STATE([]),
  getShipmentConfirmationStatuses: DEFAULT_STATE([]),
  getVoDCategories: DEFAULT_STATE([]),
  getVoDStatuses: DEFAULT_STATE([]),
  getVoDTypes: DEFAULT_STATE([]),
  getShipmentCancellationReasons: DEFAULT_STATE([]),
  getLocationReverse: DEFAULT_STATE(""),
  getJourneyStatuses: DEFAULT_STATE([]),
};

export default initialState;
