import Typography from "@mui/material/Typography";
import {
  TatumSDK,
  Network,
  type Ethereum,
  type AddressBalance,
} from "@tatumio/tatum";
import { useEffect, useState } from "react";
import { formatAddress } from "../helpers/index.ts";
import config from "../config/index.ts";
import Grid from "@mui/material/Grid";
import { connect, useDispatch } from "react-redux";
import { type WalletNetworks, type RootState } from "../types/index.ts";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CryptoIcon from "react-crypto-icons";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const wallets: Array<{
  network: WalletNetworks;
  title: string;
  address: string;
}> = [
  {
    network: "ETH",
    title: "My wallet",
    address: "0x5445A1085E5251732bD1A5a60a1E9E76b75bdF0F",
  },
  {
    network: "ETH",
    title: "Vitalik",
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  },
  {
    network: "BTC",
    title: "Random BTC address",
    address: "bc1qnr8t4tq48umfase7ylnfzu6z988wk9q0jezgqv",
  },
  {
    network: "SOL",
    title: "Random Solana address",
    address: "7Nb36gSXXVusXHGJM6a3iQbeoJ3PgwG83HLSWrg7wnEf",
  },
];

const networks: Array<{ symbol: WalletNetworks; title: string }> = [
  { symbol: "ETH", title: "Ethereum" },
  { symbol: "BTC", title: "Bitcoin" },
  { symbol: "SOL", title: "Solana" },
];

interface WalletProps {
  detail: AddressBalance;
  balance: AddressBalance[];
}

const Wallet = (props: WalletProps): JSX.Element => {
  const dispatch = useDispatch();
  const detail = props.detail;
  const balance = props.balance;
  const [network, setNetwork] = useState<WalletNetworks>("ETH");
  const [address, setAddress] = useState<string>(wallets[0].address);

  const getTatum = async () => {
    switch (network) {
      case "ETH":
        return await TatumSDK.init<Ethereum>({
          network: Network.ETHEREUM,
          apiKey: { v4: config.apiKey },
        });
      case "BTC":
        return await TatumSDK.init<Ethereum>({
          network: Network.BITCOIN,
          apiKey: { v4: config.apiKey },
        });
      case "SOL":
        return await TatumSDK.init<Ethereum>({
          network: Network.SOLANA,
          apiKey: { v4: config.apiKey },
        });
      default:
        return await TatumSDK.init<Ethereum>({
          network: Network.ETHEREUM,
          apiKey: { v4: config.apiKey },
        });
    }
  };

  const getBalance = async (address: string) => {
    console.log("get balance:", address);
    const tatum = await getTatum();
    const balance = await tatum.address.getBalance({
      addresses: [address],
    });
    if (balance.status === "SUCCESS") {
      setDetail(balance.data[0]);
      setBalance(balance.data);
    }
    await tatum.destroy();

    return balance.data;
  };

  const getTransactions = async (address: string) => {
    console.log("get transactions:", address);
    const tatum = await getTatum();
    const res = await tatum.address.getTransactions({
      address,
      pageSize: 50,
      transactionTypes: ["native", "fungible"],
    });
    if (res.status === "SUCCESS") {
      dispatch({
        type: "SET_TRANSACTIONS",
        payload: res.data,
      });
    }
    await tatum.destroy();

    return res.data;
  };

  const switchNetwork = (network: WalletNetworks) => {
    console.log("switch network", network);
    setNetwork(network);

    const address =
      network === "ETH"
        ? wallets.filter((w) => w.network === "ETH")[0]?.address
        : network === "BTC"
          ? wallets.filter((w) => w.network === "BTC")[0]?.address
          : wallets.filter((w) => w.network === "SOL")[0]?.address;

    setAddress(address);
  };

  const setBalance = (payload: AddressBalance[]) => {
    dispatch({
      type: "SET_BALLANCE",
      payload,
    });
  };

  const setDetail = (payload: AddressBalance | null) => {
    dispatch({
      type: "SET_DETAIL",
      payload,
    });
  };

  useEffect(() => {
    if (address !== undefined) {
      setBalance([]);
      setDetail(null);
      getBalance(address)
        .then((data) => {
          console.log("balance: ", data);
        })
        .catch(() => {});
      getTransactions(address)
        .then((data) => {
          console.log("transactions: ", data);
        })
        .catch(() => {});
    }
  }, [address]);

  return (
    <Grid container spacing={3}>
      {address !== undefined && (
        <>
          <Grid item md={12}>
            <FormControl fullWidth>
              <InputLabel>Network</InputLabel>
              <Select
                value={network}
                fullWidth
                onChange={(event) => {
                  const newNetwork = event.target.value as WalletNetworks;
                  switchNetwork(newNetwork);
                }}
                startAdornment={
                  <Box mr={1}>
                    <CryptoIcon name={network.toLowerCase()} size={18} />
                  </Box>
                }
                label="Network"
              >
                {networks.map((network) => (
                  <MenuItem
                    value={network.symbol}
                    key={`network-${network.symbol}`}
                  >
                    {network.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={12}>
            <Select
              value={address}
              fullWidth
              onChange={(event) => {
                const newAddress = event.target.value;
                if (newAddress !== "connect") {
                  setAddress(newAddress);
                }
              }}
            >
              {wallets
                .filter((w) => w.network === network)
                .map((wallet) => (
                  <MenuItem value={wallet.address} key={wallet.address}>
                    {wallet.title}
                  </MenuItem>
                ))}
            </Select>
          </Grid>
          <Grid item md={12}>
            <Typography variant="h5" align="center">
              {formatAddress(address)}
            </Typography>
          </Grid>
        </>
      )}
      {balance.length > 0 && (
        <Grid item md={12}>
          <List>
            {balance.map((b) => (
              <ListItemButton
                key={`${b.address}-${b.asset}`}
                onClick={() => {
                  dispatch({
                    type: "SET_DETAIL",
                    payload: b,
                  });
                }}
                selected={b.tokenAddress === detail.tokenAddress}
              >
                <ListItemText primary={b.asset} secondary={b.balance} />
              </ListItemButton>
            ))}
          </List>
        </Grid>
      )}
      {balance.length === 0 && (
        <Grid item md={12} textAlign="center">
          <Box mt={3}>
            <CircularProgress />
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default connect((state: RootState) => ({
  balance: state.balance,
  detail: state.detail,
}))(Wallet);
