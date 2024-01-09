import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { TatumSDK, Network, type Ethereum, MetaMask, type AddressBalance } from '@tatumio/tatum'
import { useEffect, useRef, useState } from 'react'
import { formatAddress } from '../helpers/index.ts'
import config from '../config/index.ts'

const ConnectMetamask = (): JSX.Element => {
  const tatum = useRef<Ethereum | null>(null)
  const [address, setAddress] = useState<string>('')
  const [balance, setBalance] = useState<AddressBalance>()

  const init = TatumSDK.init<Ethereum>({ network: Network.ETHEREUM, apiKey: { v3: config.apiKey } })

  const connectWallet = async (network: Ethereum) => {
    return await network.walletProvider.use(MetaMask).getWallet()
  }

  const getBalance = async (network: Ethereum, address: string) => {
    return await network.address.getBalance({
      addresses: [address]
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
          const balanceData = balance.data.filter(asset => asset.asset === 'ETH')[0]
          setBalance(balanceData)
          console.log('get balance', balanceData)
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
            Connect Metamask
        </Button>
      )
    : (
        <Card>
          <Typography>{formatAddress(address)}</Typography>
          <Typography>{balance?.balance}</Typography>
        </Card>
      )
}

export default ConnectMetamask
