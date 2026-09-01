import { InitialStateType } from "@sera-types/shipment-details.type";
import { DEFAULT_STATE } from "@sera-utils/constants/common";

const initialState: InitialStateType = {
  getDetails: DEFAULT_STATE({}),
};

export default initialState;
