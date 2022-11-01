import axios from 'axios'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import { AppDispatch, RootState } from '../..'

// TODO: Test this code
axios.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response.status === 401) {
      const dispatch = useDispatch<AppDispatch>()
      dispatch(userActions.logout())
      alert('Token has been expired')
    }
  }
)

/*
 * Type definitions
 */
export interface UserType {
  id: number
  username: string
}

export interface UserState {
  currentUser: UserType | null
}

export interface UserSubmitType {
  username: string
  password: string
}

/*
 * Async thunks
 */

export const requestSignup = createAsyncThunk(
  'user/requestSignup',
  async (data: UserSubmitType, { dispatch }) => {
    const response = await axios.post('/api/user/', data)
    const { token, ...userData } = response.data
    if (token) {
      axios.defaults.headers.common.Authorization = `Token ${String(token)}`
      dispatch(userActions.login(userData))
    }
    return userData
  }
)

export const requestLogin = createAsyncThunk(
  'user/requestLogin',
  async (data: UserSubmitType, { dispatch }) => {
    const response = await axios.post('/api/user/login/', data)
    const { token, ...userData } = response.data
    if (token) {
      axios.defaults.headers.common.Authorization = `Token ${String(token)}`
      axios.interceptors.response.use(
        response => response,
        async (error) => {
          if (error.response.status === 401) {
            dispatch(userActions.logout())
          }
        }
      )
      dispatch(userActions.login(userData))
    }
    return userData
  }
)

export const requestLogout = createAsyncThunk(
  'user/requestLogout',
  async (data: never, { dispatch }) => {
    const response = await axios.put('/api/user/logout/')
    dispatch(userActions.logout())
    return response
  }
)

/*
 * Lend reducer
 */

const initialState: UserState = {
  currentUser: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<UserType>
    ) => {
      const newUser: UserType = { ...action.payload }
      state.currentUser = newUser
    },
    logout: (
      state
    ) => {
      state.currentUser = null
    }
  }
})

export const userActions = userSlice.actions
export const selectUser = (state: RootState) => state.user

export default userSlice.reducer
