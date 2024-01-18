import Typography from "@mui/material/Typography";
import {
  TatumSDK,
  Network,
  type Ethereum,
  MetaMask,
  type AddressBalance,
} from "@tatumio/tatum";
import { useEffect, useRef, useState } from "react";
import { formatAddress } from "../helpers/index.ts";
import config from "../config/index.ts";
import Grid from "@mui/material/Grid";
import { connect, useDispatch } from "react-redux";
import { type RootState } from "../types/index.ts";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export interface WalletProps {
  detail: AddressBalance;
  balance: AddressBalance[];
}

const Wallet = (props: WalletProps): JSX.Element => {
  const detail = props.detail;
  const balance = props.balance;
  const dispatch = useDispatch();
  const [metamaskConnected, setMetamaskConnected] = useState(false);
  const [wallets, setWallets] = useState([
    {
      title: "My wallet",
      address: "0x5445A1085E5251732bD1A5a60a1E9E76b75bdF0F",
    },
    {
      title: "Vitalik",
      address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    },
  ]);
  const [address, setAddress] = useState<string>(wallets[0].address);

  const connectMetamask = async () => {
    const tatum = await TatumSDK.init<Ethereum>({
      network: Network.ETHEREUM,
      apiKey: { v4: config.apiKey },
    });
    const address = await tatum.walletProvider.use(MetaMask).getWallet();
    setAddress(address);
    setMetamaskConnected(true);
    setWallets((wallets) => [...wallets, { title: "MetaMask", address }]);
    tatum.destroy();
  };

  const getBalance = async (address: string) => {
    const tatum = await TatumSDK.init<Ethereum>({
      network: Network.ETHEREUM,
      apiKey: { v4: config.apiKey },
    });
    console.log("get balance:", address);
    const balance = await tatum.address.getBalance({
      addresses: [address],
    });
    if (balance.status === "SUCCESS") {
      setDetail(balance.data[0]);
      setBalance(balance.data);
      console.log("set balance:", balance.data);
    }
    tatum.destroy();
  };

  const getTransactions = async (address: string) => {
    const tatum = await TatumSDK.init<Ethereum>({
      network: Network.ETHEREUM,
      apiKey: { v4: config.apiKey },
    });
    console.log("get transactions:", address);
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
    tatum.destroy();
    console.log("set transactions:", res);
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
      getBalance(address);
      getTransactions(address);
    }
  }, [address]);

  return (
    <Grid container spacing={3}>
      {address !== undefined && (
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
            {wallets.map((wallet) => (
              <MenuItem value={wallet.address} key={wallet.address}>
                {wallet.title}
              </MenuItem>
            ))}
            {!metamaskConnected && (
              <MenuItem
                value="connect"
                onClick={() => {
                  connectMetamask();
                }}
              >
                Connect MetaMask
              </MenuItem>
            )}
          </Select>
        </Grid>
      )}
      {address !== undefined && (
        <Grid item md={12}>
          <Typography variant="h5" align="center">
            {formatAddress(address)}
          </Typography>
        </Grid>
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
