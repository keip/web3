import { connect } from 'react-redux'
import { type RootState } from '../types'
import { type AddressBalance, type AddressTransaction } from '@tatumio/tatum'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

interface WalletDetailProps {
  balance: AddressBalance[]
  transactions: AddressTransaction[]
  detail: AddressBalance | null
}

const WalletDetail = (props: WalletDetailProps) => {
  const [transactions, setTransactions] = useState(props.transactions)
  const detail = props.detail

  useEffect(() => {
    if (detail !== null) {
      const tokenAddress = detail.tokenAddress
      if (tokenAddress !== undefined) {
        setTransactions(props.transactions.filter(t => t.transactionSubtype !== 'zero-transfer' && t.tokenAddress === tokenAddress))
      } else {
        setTransactions(props.transactions.filter(t => t.transactionSubtype !== 'zero-transfer' && t.tokenAddress === undefined))
      }
    }
  }, [detail, props.transactions])

  return detail !== null
    ? (
        <Box px={3} py={6}>
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
                <Typography>No transactions</Typography>
              </Grid>
            )}
            {transactions.map((transaction, key) => {
              return (
              <Grid item md={12} key={`${transaction.address}-${key}`}>
                <Card>
                  <CardContent>
                    <Typography color={transaction.transactionSubtype === 'incoming' ? 'green' : 'red'}>
                      {transaction.transactionSubtype === 'incoming' && '+'}{transaction.amount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              )
            })}
          </Grid>
        </Box>
      )
    : null
}

export default connect((state: RootState) => ({
  balance: state.balance,
  detail: state.detail,
  transactions: state.transactions
}))(WalletDetail)
