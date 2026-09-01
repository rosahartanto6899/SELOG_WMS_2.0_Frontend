import { JourneyHistoryState } from "@sera-types/journey-history.type";
import {
  DEFAULT_STATE,
  DEFAULT_STATE_OPTIONS,
} from "@sera-utils/constants/common";

const initialState: JourneyHistoryState = {
  getSummary: DEFAULT_STATE({}),
  getJourneyList: DEFAULT_STATE_OPTIONS([]),
  getACJourneyList: DEFAULT_STATE_OPTIONS([]),
  getJourneyDetail: DEFAULT_STATE({}),
};

export default initialState;
