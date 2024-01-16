import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { TatumSDK, Network, type Ethereum, MetaMask, type AddressBalance } from '@tatumio/tatum'
import { useEffect, useRef, useState } from 'react'
import { formatAddress } from '../helpers/index.ts'
import config from '../config/index.ts'
import Grid from '@mui/material/Grid'
import CryptoIcon from 'react-crypto-icons'
import { connect, useDispatch } from 'react-redux'
import { type RootState } from '../types/index.ts'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

// const wallet1 = '0x5445A1085E5251732bD1A5a60a1E9E76b75bdF0F'

export interface WalletProps {
  balance: AddressBalance[]
}

const Wallet = (props: WalletProps): JSX.Element => {
  const balance = props.balance
  const dispatch = useDispatch()
  const tatum = useRef<Ethereum | null>(null)
  const [address, setAddress] = useState<string>()
  const init = TatumSDK.init<Ethereum>({ network: Network.ETHEREUM, apiKey: { v4: config.apiKey } })

  const connectWallet = () => {
    tatum.current?.walletProvider.use(MetaMask).getWallet().then((address) => {
      setAddress(address)
      console.log(`wallet connected: ${address}`)
      getBalance(address)
      getTransactions(address)
    }).catch(() => {
      // todo: wallet not connected
    })
  }

  const getBalance = (address: string) => {
    console.log('get balance:', address)
    tatum.current?.address.getBalance({
      addresses: [address]
    }).then((balance) => {
      if (balance.status === 'SUCCESS') {
        dispatch({
          type: 'SET_DETAIL',
          payload: balance.data[0]
        })
        dispatch({
          type: 'SET_BALLANCE',
          payload: balance.data
        })
      }
    }).catch(() => {})
  }

  const getTransactions = (address: string) => {
    console.log('get transactions:', address)
    tatum.current?.address.getTransactions({
      address,
      pageSize: 50,
      transactionTypes: ['native', 'fungible']
    }).then((res) => {
      if (res.status === 'SUCCESS') {
        dispatch({
          type: 'SET_TRANSACTIONS',
          payload: res.data
        })
      }
      console.log('set transactions:', res.data)
    }).catch(() => {})
  }

  useEffect(() => {
    // init tatum
    init.then((network) => {
      tatum.current = network
      console.log('initialized')
      // setAddress(wallet1)
      // getBalance(wallet1)
      // getTransactions(wallet1)
    }).catch(() => {
      // todo: tatum not initialized
    })
  }, [])

  return address === undefined
    ? (
        <Button onClick={() => {
          if (tatum.current !== null) {
            connectWallet()
          }
        }}>
            Connect Wallet
        </Button>
      )
    : (
        <Grid container spacing={3}>
          <Grid item>
            <CryptoIcon name="eth" size={25} />
          </Grid>
          <Grid item flex={1}>
            <Typography variant="h5" align="center">{formatAddress(address)}</Typography>
          </Grid>
          {balance.length > 0 && (
            <Grid item md={12}>
              <List>
                {balance.map(b => (
                  <ListItemButton key={`${b.address}-${b.asset}`} onClick={() => {
                    dispatch({
                      type: 'SET_DETAIL',
                      payload: b
                    })
                  }}>
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
      )
}

export default connect((state: RootState) => ({
  balance: state.balance
}))(Wallet)
