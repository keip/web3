import Button from '@mui/material/Button'
import { TatumSDK, Network, type Ethereum, MetaMask } from '@tatumio/tatum'

const ConnectMetamask = (): JSX.Element => {
  const connect = async (): Promise<undefined> => {
    const tatum = await TatumSDK.init<Ethereum>({ network: Network.ETHEREUM })
    const metamaskAccount = await tatum.walletProvider.use(MetaMask).getWallet()
    console.log(metamaskAccount)
  }

  return (
        <Button onClick={() => { connect().then(() => {}).catch(() => {}) }}>
            Connect Metamask
        </Button>
  )
}

export default ConnectMetamask
