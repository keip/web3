import { type AddressTransaction } from "@tatumio/tatum";

export type TransactionsReducerActions = "SET_TRANSACTIONS";
const initialState: AddressTransaction[] = [];

const transactionsReducer = (
  state = initialState,
  action: {
    type: TransactionsReducerActions;
    payload: AddressTransaction[];
  },
) => {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return action.payload;
    default:
      return state;
  }
};

export default transactionsReducer;
