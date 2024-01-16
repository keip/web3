import { combineReducers } from '@reduxjs/toolkit'
import balance from './balance.reducer.ts'
import detail from './detail.reducer.ts'
import transactions from './transactions.reducer.ts'

export default combineReducers({
  balance,
  detail,
  transactions
})
