import { PairingMatchingState } from "@sera-types/pairing-matching";
import {
  DEFAULT_STATE,
  DEFAULT_STATE_OPTIONS,
} from "@sera-utils/constants/common";

const initialState: PairingMatchingState = {
  getSummary: DEFAULT_STATE({}),
  getUnitPosition: DEFAULT_STATE([]),
  getUnitDetail: DEFAULT_STATE({}),
  getDemands: DEFAULT_STATE_OPTIONS([]),
  getACDemands: DEFAULT_STATE_OPTIONS([]),
  getUnpairedUnit: DEFAULT_STATE_OPTIONS([]),
  getACUnpairedUnit: DEFAULT_STATE_OPTIONS([]),
  getUnpairedDriver: DEFAULT_STATE_OPTIONS([]),
  getACUnpairedDriver: DEFAULT_STATE_OPTIONS([]),
  pairingProcess: DEFAULT_STATE({}),
  getCapacityPaired: DEFAULT_STATE_OPTIONS([]),
  getACCapacityPaired: DEFAULT_STATE_OPTIONS([]),
  pairingConfirm: DEFAULT_STATE({}),
  getPairingHistory: DEFAULT_STATE({}),
};

export default initialState;
