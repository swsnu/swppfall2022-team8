import axios from 'axios'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../..'
import { LendType } from '../lend/lend'
import { BookType } from '../book/book'

/*
 * Type definitions
 */
export interface UserType {
  id: number
  username: string
}

export interface UserState {
  count: number
  next: string | null
  prev: string | null
  currentUser: UserType | null
  subscribed_tags: string[]
  watch_list: LendType[]
  recommend: RecommendType
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
  is_queued: boolean
  is_outdated: boolean
  enqueued: boolean
  recommend_list: BookType[]
}

export interface WatchPageResponse {
  count: number
  next: string | null
  previous: string | null
  results: LendType[]
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
      const drfToken = `Token ${String(token)}`
      sessionStorage.setItem('drf-token', drfToken)
      axios.defaults.headers.common.Authorization = drfToken
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
      const drfToken = `Token ${String(token)}`
      sessionStorage.setItem('drf-token', drfToken)
      axios.defaults.headers.common.Authorization = drfToken
      dispatch(userActions.login(userData))
    }
    return userData
  }
)

export const requestLogout = createAsyncThunk(
  'user/requestLogout',
  async (data: never, { dispatch }) => {
    const response = await axios.put('/api/user/logout/')
    axios.defaults.headers.common.Authorization = ''
    sessionStorage.removeItem('drf-token')
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
  async (params?: { page: number }) => {
    const response = await axios.get<WatchPageResponse>('/api/user/watch/', { params })
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
    const response = await axios.get<RecommendType>('/api/user/recommend/')
    return response.data
  }
)

/*
 * User reducer
 */

const initialState: UserState = {
  count: 0,
  next: null,
  prev: null,
  currentUser: null,
  subscribed_tags: [],
  watch_list: [],
  recommend: {
    is_queued: false,
    is_outdated: false,
    enqueued: false,
    recommend_list: []
  }
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
      state.recommend = {
        is_queued: false,
        is_outdated: false,
        enqueued: false,
        recommend_list: []
      }
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
      console.error(action.error)
    })
    builder.addCase(requestLogin.rejected, (_state, action) => {
      console.error(action.error)
    })
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.subscribed_tags = action.payload
    })
    builder.addCase(updateTag.rejected, (_state, action) => {
      console.error(action.error)
    })
    builder.addCase(fetchWatch.fulfilled, (state, action) => {
      state.count = action.payload.count
      state.next = action.payload.next
      state.prev = action.payload.previous
      state.watch_list = action.payload.results
    })
    builder.addCase(fetchRecommend.fulfilled, (state, action) => {
      state.recommend = action.payload
    })
  }
})

export const userActions = userSlice.actions
export const selectUser = (state: RootState) => state.user

export default userSlice.reducer
