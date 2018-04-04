import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import userReducer from './user/userReducer'
import { drizzleReducers } from 'drizzle'

const reducer = combineReducers({
  routing: routerReducer,
  user: userReducer,
  ...drizzleReducers
})

export default reducer
