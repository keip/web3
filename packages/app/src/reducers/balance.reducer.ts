import { type AddressBalance } from "@tatumio/tatum";

export type BallanceReducerActions = "SET_BALLANCE";
const initialState: AddressBalance[] = [];

const ballanceReducer = (
  state = initialState,
  action: {
    type: BallanceReducerActions;
    payload: AddressBalance[];
  },
) => {
  switch (action.type) {
    case "SET_BALLANCE":
      return action.payload;
    default:
      return state;
  }
};

export default ballanceReducer;
