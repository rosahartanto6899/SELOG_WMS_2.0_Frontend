import { VoDState } from "@sera-types/voice-of-driver.type";
import {
  DEFAULT_STATE,
  DEFAULT_STATE_OPTIONS,
} from "@sera-utils/constants/common";

const initialState: VoDState = {
  getSummary: DEFAULT_STATE({}),
  getVoDList: DEFAULT_STATE_OPTIONS([]),
  getACVoDList: DEFAULT_STATE_OPTIONS([]),
  getShipment: DEFAULT_STATE_OPTIONS([]),
  createVoD: DEFAULT_STATE({}),
  detailVoD: DEFAULT_STATE({}),
  updateVoD: DEFAULT_STATE({}),
};

export default initialState;
