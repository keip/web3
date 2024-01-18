import { type AddressBalance } from "@tatumio/tatum";

export type DetailReducerActions = "SET_DETAIL";
const initialState: AddressBalance | null = null;

const DetailReducer = (
  state = initialState,
  action: {
    type: DetailReducerActions;
    payload: AddressBalance;
  },
) => {
  switch (action.type) {
    case "SET_DETAIL":
      return action.payload;
    default:
      return state;
  }
};

export default DetailReducer;
