import { ITracingTrackingState } from "@sera-types/tracking-tracking.type";
import {
  DEFAULT_STATE,
  DEFAULT_STATE_OPTIONS,
} from "@sera-utils/constants/common";

const initialState: ITracingTrackingState = {
  getSummary: DEFAULT_STATE({}),
  getList: DEFAULT_STATE_OPTIONS([]),
  getDetails: DEFAULT_STATE({}),
};

export default initialState;
