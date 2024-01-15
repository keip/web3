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

const wallet1 = '0x5445A1085E5251732bD1A5a60a1E9E76b75bdF0F'

export interface WalletProps {
  balance: AddressBalance[]
}

const Wallet = (props: WalletProps): JSX.Element => {
  const [balance, setBalance] = useState(props.balance)
  const dispatch = useDispatch()
  const tatum = useRef<Ethereum | null>(null)
  const [address, setAddress] = useState<string>('')
  const init = TatumSDK.init<Ethereum>({ network: Network.ETHEREUM, apiKey: { v3: config.apiKey } })

  const connectWallet = async (network: Ethereum) => {
    return await network.walletProvider.use(MetaMask).getWallet()
  }

  const getBalance = (network: Ethereum, address: string) => {
    network.address.getBalance({
      // addresses: [address]
      addresses: [wallet1]
    }).then((balance) => {
      if (balance.status === 'SUCCESS') {
        console.log('get balance', balance)
        dispatch({
          type: 'SET_BALLANCE',
          payload: balance.data
        })
      }
    }).catch(() => {})
  }

  useEffect(() => {
    // init tatum
    init.then((network) => {
      tatum.current = network
      console.log('initialized')

      // auto-connect wallet
      connectWallet(network).then((address) => {
        console.log(`wallet connected: ${address}`)
        setAddress(address)
        getBalance(network, address)
      }).catch(() => {
        // todo: wallet not connected
      })
    }).catch(() => {
      // todo: tatum not initialized
    })
  }, [])

  useEffect(() => {
    setBalance(props.balance)
  }, [props.balance])

  return address === undefined
    ? (
        <Button onClick={() => {
          if (tatum.current !== null) {
            connectWallet(tatum.current).then(() => {}).catch(() => {})
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
          <Grid item md={12}>
            <List>
              {balance?.map(b => (
                <ListItemButton key={`${b.address}-${b.asset}`}>
                  <ListItemText primary={b.asset} secondary={b.balance} />
                </ListItemButton>
              ))}
            </List>
          </Grid>
        </Grid>
      )
}

export default connect((state: RootState) => ({
  balance: state.balance
}))(Wallet)
