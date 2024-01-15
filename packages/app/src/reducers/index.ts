import { combineReducers } from '@reduxjs/toolkit'
import balance from './balance.reducer.ts'
import detail from './detail.reducer.ts'

export default combineReducers({
  balance,
  detail
})
