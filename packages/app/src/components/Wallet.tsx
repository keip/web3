import Typography from '@mui/material/Typography'
import { TatumSDK, Network, type Ethereum, MetaMask, type AddressBalance } from '@tatumio/tatum'
import { useEffect, useRef, useState } from 'react'
import { formatAddress } from '../helpers/index.ts'
import config from '../config/index.ts'
import Grid from '@mui/material/Grid'
import { connect, useDispatch } from 'react-redux'
import { type RootState } from '../types/index.ts'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

export interface WalletProps {
  detail: AddressBalance
  balance: AddressBalance[]
}

const Wallet = (props: WalletProps): JSX.Element => {
  const detail = props.detail
  const balance = props.balance
  const dispatch = useDispatch()
  const tatum = useRef<Ethereum | null>(null)
  const [metamaskConnected, setMetamaskConnected] = useState(false)
  const [address, setAddress] = useState<string>('0x5445A1085E5251732bD1A5a60a1E9E76b75bdF0F')
  const [wallets, setWallets] = useState([
    {
      title: 'My wallet',
      address: '0x5445A1085E5251732bD1A5a60a1E9E76b75bdF0F'
    },
    {
      title: 'Vitalik',
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    }
  ])
  const init = TatumSDK.init<Ethereum>({ network: Network.ETHEREUM, apiKey: { v4: config.apiKey } })

  const connectMetamask = () => {
    tatum.current?.walletProvider.use(MetaMask).getWallet().then((address) => {
      setAddress(address)
      setMetamaskConnected(true)
      setWallets(wallets => [...wallets, { title: 'MetaMask', address }])
      console.log(`wallet connected: ${address}`)
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
        console.log('set balance:', balance.data)
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
    dispatch({
      type: 'SET_BALLANCE',
      payload: []
    })
    dispatch({
      type: 'SET_DETAIL',
      payload: null
    })
    getBalance(address)
    getTransactions(address)
  }, [address])

  useEffect(() => {
    // init tatum
    init.then((network) => {
      tatum.current = network
      console.log('initialized')
      setAddress(address)
      getBalance(address)
      getTransactions(address)
    }).catch(() => {
      // todo: tatum not initialized
    })
  }, [])

  return (
    <Grid container spacing={3}>
      <Grid item md={12}>
        <Select value={address} fullWidth onChange={(event) => {
          const newAddress = event.target.value
          if (newAddress !== 'connect') {
            setAddress(newAddress)
          }
        }}>
          {wallets.map(wallet => (
            <MenuItem value={wallet.address} key={wallet.address}>
              {wallet.title}
            </MenuItem>
          ))}
          {!metamaskConnected && (
            <MenuItem value="connect" onClick={() => {
              connectMetamask()
            }}>
              Connect MetaMask
            </MenuItem>
          )}
        </Select>
      </Grid>
      <Grid item md={12}>
        <Typography variant="h5" align="center">{formatAddress(address)}</Typography>
      </Grid>
      {balance.length > 0 && (
        <Grid item md={12}>
          <List>
            {balance.map(b => (
              <ListItemButton
                key={`${b.address}-${b.asset}`}
                onClick={() => {
                  dispatch({
                    type: 'SET_DETAIL',
                    payload: b
                  })
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
  )
}

export default connect((state: RootState) => ({
  balance: state.balance,
  detail: state.detail
}))(Wallet)
