import axios from 'axios'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../..'
import { LendType } from '../lend/lend'

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
  watch_list: LendType[]
  recommend_list: RecommendType[]
}

export interface UserSubmitType {
  username: string
  password: string
}

export interface TagType {
  tag: string
}

export interface ToggleTagResponseType {
  created: boolean
  tag: string
}

export interface ToggleWatchResponseType {
  created: boolean
  lend_info: LendType
}

export interface RecommendType {
  id: number
  image: string
  title: string
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
    return response.data
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

export const fetchWatch = createAsyncThunk(
  'user/fetchWatch',
  async () => {
    const response = await axios.get<LendType[]>('/api/user/watch/')
    return response.data
  }
)

export const toggleWatch = createAsyncThunk(
  'user/toggleWatch',
  async (data: { 'lend_id': number }, { dispatch }) => {
    const response = await axios.put('/api/user/watch/', data)
    dispatch(userActions.toggleWatch(response.data))
    return response.data
  }
)

export const fetchRecommend = createAsyncThunk(
  'user/fetchRecommend',
  async () => {
    const response = await axios.get<RecommendType[]>('/api/user/recommend/')
    return response.data
  }
)

/*
 * User reducer
 */

const initialState: UserState = {
  currentUser: null,
  subscribed_tags: [],
  watch_list: [],
  recommend_list: []
}

export const errorPrefix = (code: number) => `Request failed with status code ${code}`

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
      state.watch_list = []
      state.recommend_list = []
    },
    updateTag: (
      state,
      action: PayloadAction<ToggleTagResponseType>
    ) => {
      if (action.payload.created) {
        state.subscribed_tags.push(action.payload.tag)
      } else {
        state.subscribed_tags = state.subscribed_tags.filter(
          tag => tag !== action.payload.tag
        )
      }
    },
    toggleWatch: (
      state,
      action: PayloadAction<ToggleWatchResponseType>
    ) => {
      if (action.payload.created) {
        state.watch_list.push(action.payload.lend_info)
      } else {
        state.watch_list = state.watch_list.filter(
          watch => watch.book !== action.payload.lend_info.book
        )
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(requestSignup.rejected, (_state, action) => {
      if (action.error.message === errorPrefix(409)) {
        alert('Username is duplicated')
      } else {
        alert('Error on signup')
      }
      console.error(action.error)
    })
    builder.addCase(requestLogin.rejected, (_state, action) => {
      if (action.error.message?.startsWith(errorPrefix(4))) {
        alert('Username or Password is wrong')
      } else {
        alert('Error on login')
      }
      console.error(action.error)
    })
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.subscribed_tags = action.payload
    })
    builder.addCase(updateTag.rejected, (_state, action) => {
      if (action.error.message === errorPrefix(404)) {
        alert('The tag does not exist in DB.')
      } else {
        alert('Error on update tags')
      }
    })
    builder.addCase(fetchWatch.fulfilled, (state, action) => {
      state.watch_list = action.payload
    })
    builder.addCase(fetchRecommend.fulfilled, (state, action) => {
      state.recommend_list = action.payload
    })
  }
})

export const userActions = userSlice.actions
export const selectUser = (state: RootState) => state.user

export default userSlice.reducer
