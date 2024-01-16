import { connect } from 'react-redux'
import { type RootState } from '../types'
import { type Ethereum, Network, TatumSDK, type AddressBalance, type AddressTransaction } from '@tatumio/tatum'
import config from '../config/index.ts'
import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

interface WalletDetailProps {
  detail: AddressBalance | null
}

const WalletDetail = (props: WalletDetailProps) => {
  const [transactions, setTransactions] = useState<AddressTransaction[]>([])
  const [detail, setDetail] = useState(props.detail)
  const tatum = useRef<Ethereum | null>(null)
  const init = TatumSDK.init<Ethereum>({ network: Network.ETHEREUM, apiKey: { v4: config.apiKey } })

  const getTransactions = () => {
    setTransactions([])
    if (detail !== null) {
      const address = detail.tokenAddress !== null ? detail.tokenAddress : detail.address
      if (address !== undefined) {
        console.log('get transactions')
        tatum.current?.address.getTransactions({
          address
        }).then((res) => {
          if (res.status === 'SUCCESS') {
            setTransactions(res.data)
          }
          console.log(res)
        }).catch(() => {})
      }
    }
  }

  useEffect(() => {
    init.then((network: Ethereum) => {
      tatum.current = network
    }).catch(() => {})
  }, [])

  useEffect(() => {
    setDetail(props.detail)
    getTransactions()
  }, [props.detail])

  return detail !== null
    ? (
        <Box p={3}>
          <Grid container spacing={3}>
            <Grid item md={12}>
              <Typography variant="h3">
                {detail.asset}
              </Typography>
            </Grid>
            <Grid item md={12}>
              <Typography variant="h4">
                {detail.balance}
              </Typography>
            </Grid>
            {transactions.length === 0 && (
              <Grid item md={12}>
                <CircularProgress />
              </Grid>
            )}
            {transactions.map(transaction => (
              <Grid item md={12} key={transaction.hash}>
                {transaction.amount}
              </Grid>
            ))}
          </Grid>
        </Box>
      )
    : null
}

export default connect((state: RootState) => ({
  detail: state.detail
}))(WalletDetail)
