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
  subscribed_tags: string[]
}

export interface UserSubmitType {
  username: string
  password: string
}

export interface TagType {
  tag: string
}

export interface ToggleResponseType {
  created: boolean
  tag: string
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
      dispatch(fetchTags())
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

export const fetchTags = createAsyncThunk(
  'user/fetchTags',
  async () => {
    const response = await axios.get('/api/user/tag/')
    return response.data
  }
)

export const updateTag = createAsyncThunk(
  'user/updateTag',
  async (data: TagType, { dispatch }) => {
    const response = await axios.put('/api/user/tag/', data)
    dispatch(userActions.updateTag(response.data))
    return response.data
  }
)

/*
 * Lend reducer
 */

const initialState: UserState = {
  currentUser: null,
  subscribed_tags: []
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
      state.subscribed_tags = []
    },
    updateTag: (
      state,
      action: PayloadAction<ToggleResponseType>
    ) => {
      if (action.payload.created) {
        state.subscribed_tags.push(action.payload.tag)
      } else {
        state.subscribed_tags = state.subscribed_tags.filter(
          tag => tag !== action.payload.tag
        )
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.subscribed_tags = action.payload
    })
  }
})

export const userActions = userSlice.actions
export const selectUser = (state: RootState) => state.user

export default userSlice.reducer
