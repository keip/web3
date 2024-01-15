import { connect } from 'react-redux'
import { type RootState } from '../types'

const WalletDetail = () => {
  return (
        <div></div>
  )
}

export default connect((state: RootState) => ({
  balance: state.balance
}))(WalletDetail)
