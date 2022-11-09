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
}

export interface RoomState {
  rooms_lend: RoomType[]
  rooms_borrow: RoomType[]
}

/*
 * Async thunks
 */

export const fetchUserRooms = createAsyncThunk(
  'room/fetchUserRooms',
  async () => {
    const response = await axios.get<RoomState>('/api/room/')
    return response.data
  }
)

export const createRoom = createAsyncThunk(
  'room/createRoom',
  async (data: Pick<RoomType, 'lend_id'>, { dispatch }) => {
    const response = await axios.post('/api/room/', data)
    dispatch(roomActions.addRoom(response.data))
    return response.data
  }
)

/*
 * Room reducer
 */

const initialState: RoomState = {
  rooms_lend: [],
  rooms_borrow: []
}

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    addRoom: (
      state,
      action: PayloadAction<RoomType>
    ) => {
      const newRoom = { ...action.payload }
      state.rooms_borrow.push(newRoom)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserRooms.fulfilled, (state, action) => {
      state.rooms_lend = action.payload.rooms_lend
      state.rooms_borrow = action.payload.rooms_borrow
    })
    builder.addCase(createRoom.rejected, (_state, action) => {
      console.error(action.error)
    })
  }
})

export const roomActions = roomSlice.actions
export const selectRoom = (state: RootState) => state.room

export default roomSlice.reducer
