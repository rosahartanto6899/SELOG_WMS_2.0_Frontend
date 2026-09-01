import { InitialStateType } from "@sera-types/pod-collection.type";
import {
  DEFAULT_STATE,
  DEFAULT_STATE_OPTIONS,
} from "@sera-utils/constants/common";

const initialState: InitialStateType = {
  getSummary: DEFAULT_STATE({}),
  getList: DEFAULT_STATE_OPTIONS([]),
  getDetails: DEFAULT_STATE({}),
  podLoading: DEFAULT_STATE({}),
  podUnloading: DEFAULT_STATE({}),
  podDelivery: DEFAULT_STATE({}),
  podTimestamp: DEFAULT_STATE({}),
  podHardcopy: DEFAULT_STATE({}),
  podApproval: DEFAULT_STATE({}),
};

export default initialState;
