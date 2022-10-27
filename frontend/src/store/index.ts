import { configureStore } from '@reduxjs/toolkit'

import bookReducer from './slices/book/book'
import lendReducer from './slices/lend/lend'
import borrowReducer from './slices/borrow/borrow'

export const store = configureStore({
  reducer: {
    book: bookReducer,
    lend: lendReducer,
    borrow: borrowReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch
