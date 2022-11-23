import axios from 'axios'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import storageSession from 'redux-persist/lib/storage/session'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'

import bookReducer from './slices/book/book'
import lendReducer from './slices/lend/lend'
import borrowReducer from './slices/borrow/borrow'
import userReducer, { userActions, tokenExpireSeconds } from './slices/user/user'
import roomReducer from './slices/room/room'

/*
 * Token expiration handling logic
 */

const getDrfToken = () => {
  const drfToken = document.cookie.split('; ').find(key => key.startsWith('drfToken='))?.split('=')[1]
  return drfToken ?? ''
}

axios.interceptors.request.use(
  async (config) => {
    config.headers = { Authorization: getDrfToken() }
    return config
  }
)

axios.interceptors.response.use(
  async (response) => {
    document.cookie = `drfToken=${getDrfToken()}; max-age=${tokenExpireSeconds}` // TODO: secure
    return response
  },
  async (error) => {
    if (error.response.status === 401) {
      persistedStore.dispatch(userActions.logout())
      alert('Token has been expired')
    } else throw error
  }
)

/*
 * Non-persisted Store (only for testing / typescript typing)
 */

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

/*
 * Persisted Store (actually used)
 */

const reducers = combineReducers({
  book: bookReducer,
  lend: lendReducer,
  borrow: borrowReducer,
  user: userReducer,
  room: roomReducer
})

const persistConfig = {
  key: 'root',
  storage: storageSession
}

const persistedReducer = persistReducer(persistConfig, reducers)

export const persistedStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
})

export const persistor = persistStore(persistedStore)
