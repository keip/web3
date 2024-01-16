import { type AddressBalance } from '@tatumio/tatum'

export interface RootState {
  balance: AddressBalance[]
  detail: AddressBalance
}
