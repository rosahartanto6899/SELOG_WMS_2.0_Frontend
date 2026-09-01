import { JMPState } from "@sera-types/jmp.type";
import {
  DEFAULT_STATE,
  DEFAULT_STATE_OPTIONS,
} from "@sera-utils/constants/common";

const initialState: JMPState = {
  getSummary: DEFAULT_STATE({}),
  getJMPList: DEFAULT_STATE_OPTIONS([]),
  getACJMPList: DEFAULT_STATE_OPTIONS([]),
  createJMP: DEFAULT_STATE({}),
  detailJMP: DEFAULT_STATE({}),
  updateJMP: DEFAULT_STATE({}),
};

export default initialState;
