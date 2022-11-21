import axios from 'axios'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../..'
import { UserType } from '../user/user'

/*
 * Type definitions
 */

export interface RoomType {
  id: number
  lend_id: number
  lender: UserType['id']
  lender_username: UserType['username']
  borrower: UserType['id']
  borrower_username: UserType['username']
  questions: string[]
  answers: string[]
}

export interface RoomState {
  next: string | null
  prev: string | null
  rooms: RoomType[]
  selectedRoom: RoomType | null
}

export interface RoomResponse {
  next: string | null
  previous: string | null
  results: RoomType[]
}

/*
 * Async thunks
 */

export const fetchUserRooms = createAsyncThunk(
  'room/fetchUserRooms',
  async () => {
    const response = await axios.get<RoomResponse>('/api/room/')
    return response.data
  }
)

export const fetchNextUserRooms = createAsyncThunk<RoomResponse, undefined, { state: { room: RoomState } }>(
  'room/fetchNextUserRooms',
  async (_data, { getState }) => {
    const params = { cursor: getState().room.next }
    const response = await axios.get<RoomResponse>('/api/room/', { params })
    return response.data
  }
)

export const createRoom = createAsyncThunk(
  'room/createRoom',
  async (data: Pick<RoomType, 'lend_id' | 'answers'>, { dispatch }) => {
    const response = await axios.post('/api/room/', data)
    dispatch(roomActions.selectRoom(response.data))
    return response.data
  }
)

/*
 * Room reducer
 */

const initialState: RoomState = {
  next: null,
  prev: null,
  rooms: [],
  selectedRoom: null
}

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    selectRoom: (
      state,
      action: PayloadAction<RoomType>
    ) => {
      const newRoom = { ...action.payload }
      state.selectedRoom = newRoom
    },
    clearRoom: (
      state
    ) => {
      state.selectedRoom = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserRooms.fulfilled, (state, action) => {
      state.next = action.payload.next
      state.prev = action.payload.previous
      state.rooms = action.payload.results
    })
    builder.addCase(fetchNextUserRooms.fulfilled, (state, action) => {
      state.next = action.payload.next
      state.prev = action.payload.previous
      state.rooms = [...state.rooms, ...action.payload.results]
    })
    builder.addCase(createRoom.rejected, (_state, action) => {
      console.error(action.error)
    })
  }
})

export const roomActions = roomSlice.actions
export const selectRoom = (state: RootState) => state.room

export default roomSlice.reducer
