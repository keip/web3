import { type AddressTransaction, type AddressBalance } from "@tatumio/tatum";

export interface RootState {
  balance: AddressBalance[];
  transactions: AddressTransaction[];
  detail: AddressBalance;
}

export type WalletNetworks = "ETH" | "BTC" | "SOL";
