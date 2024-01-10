import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { TatumSDK, Network, type Ethereum, MetaMask, type AddressBalance } from '@tatumio/tatum'
import { useEffect, useRef, useState } from 'react'
import { formatAddress } from '../helpers/index.ts'
import config from '../config/index.ts'
import Grid from '@mui/material/Grid'
import CryptoIcon from 'react-crypto-icons'

const wallet1 = '0x5445A1085E5251732bD1A5a60a1E9E76b75bdF0F'

const ConnectMetamask = (): JSX.Element => {
  const tatum = useRef<Ethereum | null>(null)
  const [address, setAddress] = useState<string>('')
  const [balance, setBalance] = useState<AddressBalance[]>([])

  const init = TatumSDK.init<Ethereum>({ network: Network.ETHEREUM, apiKey: { v3: config.apiKey } })

  const connectWallet = async (network: Ethereum) => {
    return await network.walletProvider.use(MetaMask).getWallet()
  }

  const getBalance = async (network: Ethereum, address: string) => {
    return await network.address.getBalance({
      // addresses: [address]
      addresses: [wallet1]
    })
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

        getBalance(network, address).then((balance) => {
          if (balance.status === 'SUCCESS') {
            console.log('get balance', balance)
            setBalance(balance.data)
          }
          // todo: get balance done
        }).catch(() => {})
      }).catch(() => {
        // todo: wallet not connected
      })
    }).catch(() => {
      // todo: tatum not initialized
    })
  }, [])

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
        <Grid container>
          <Grid item md={2}>
            <CryptoIcon name="eth" size={25} />
          </Grid>
          <Grid item md={10}>
            <Typography variant="h6" align="center">{formatAddress(address)}</Typography>
          </Grid>
          {balance.map(b => (
            <Grid item md={12} key={`${b.address}-${b.asset}`}>
              <Typography>{b.asset}</Typography>
              <Typography>{b.balance}</Typography>
            </Grid>
          ))}
        </Grid>
      )
}

export default ConnectMetamask
