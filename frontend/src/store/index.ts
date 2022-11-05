import axios from 'axios'
import { configureStore } from '@reduxjs/toolkit'

import bookReducer from './slices/book/book'
import lendReducer from './slices/lend/lend'
import borrowReducer from './slices/borrow/borrow'
import userReducer, { userActions } from './slices/user/user'
import roomReducer from './slices/room/room'

// TODO: Test this code
axios.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response.status === 401) {
      store.dispatch(userActions.logout())
      alert('Token has been expired')
    }
    throw error
  }
)

export const store = configureStore({
  reducer: {
    book: bookReducer,
    lend: lendReducer,
    borrow: borrowReducer,
    user: userReducer,
    room: roomReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch
