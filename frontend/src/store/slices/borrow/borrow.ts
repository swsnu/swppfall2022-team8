import axios from 'axios'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../..'
import { UserType } from '../user/user'

/*
 * Type definitions
 */

export interface BorrowType {
  id: number
  borrower: UserType['id']
  borrower_username: UserType['username']
  image: string
  lend_id: number
  book_title: string
  lend_cost: number
  active: boolean
  lend_start_time: string // serialized Date object
  lend_end_time: string | null // serialized Date object | null
};

export interface BorrowState {
  count: number
  next: string | null
  prev: string | null
  userBorrows: BorrowType[]
  selectedBorrow: BorrowType | null
};

export interface BorrowPageResponse {
  count: number
  next: string | null
  previous: string | null
  results: BorrowType[]
}

/*
 * Async thunks
 */

export const createBorrow = createAsyncThunk(
  'borrow/createBorrow',
  async (data: Pick<BorrowType, 'borrower' | 'lend_id'>, { dispatch }) => {
    const response = await axios.post('/api/borrow/', data)
    dispatch(borrowActions.addBorrow(response.data))
    return response.data
  }
)

export const toggleBorrowStatus = createAsyncThunk(
  'borrow/toggleBorrowStatus',
  async (id: BorrowType['id'], { dispatch }) => {
    const response = await axios.put(`/api/borrow/${id}/`)
    dispatch(borrowActions.updateBorrow(response.data))
    return response.data
  }
)

export const fetchUserBorrows = createAsyncThunk(
  'borrow/fetchUserBorrows',
  async (params?: { page: number }) => {
    const response = await axios.get<BorrowPageResponse>('/api/borrow/user/', { params })
    return response.data
  }
)

/*
 * Borrow reducer
 */

const initialState: BorrowState = {
  count: 0,
  next: null,
  prev: null,
  userBorrows: [],
  selectedBorrow: null
}

export const borrowSlice = createSlice({
  name: 'borrow',
  initialState,
  reducers: {
    addBorrow: (
      state,
      action: PayloadAction<BorrowType>
    ) => {
      const newBorrow: BorrowType = { ...action.payload }
      state.userBorrows.push(newBorrow)
      state.selectedBorrow = newBorrow
    },
    updateBorrow: (
      state,
      action: PayloadAction<BorrowType>
    ) => {
      state.userBorrows = state.userBorrows.map(
        borrow => (borrow.id === action.payload.id) ? action.payload : borrow
      )
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserBorrows.fulfilled, (state, action) => {
      state.count = action.payload.count
      state.next = action.payload.next
      state.prev = action.payload.previous
      state.userBorrows = action.payload.results
    })
    builder.addCase(createBorrow.rejected, (_state, action) => {
      console.error(action.error)
    })
  }
})

export const borrowActions = borrowSlice.actions
export const selectBorrow = (state: RootState) => state.borrow

export default borrowSlice.reducer
