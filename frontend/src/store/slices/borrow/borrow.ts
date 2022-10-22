import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../..";
import { LendType } from "../lend/lend";


/*
 * Type definitions
 */

export interface BorrowType {
  id: number;
  borrower: number;
  book_borrowed: LendType;
  active: boolean;
  lend_start_time: Date;
  lend_end_time: Date;
};

export interface BorrowState {
  borrows: BorrowType[];
  selectedBorrow: BorrowType | null;
};


/*
 * Async thunks
 */

export const fetchUserBorrows = createAsyncThunk(
  "borrow/fetchUserBorrows",
  async () => {
    const response = await axios.get<BorrowType[]>("/api/borrow/user/");
    return response.data;
  }
);


/*
 * Article reducer
 */

const initialState: BorrowState = {
  borrows: [],
  selectedBorrow: null,
};

export const borrowSlice = createSlice({
  name: "borrow",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserBorrows.fulfilled, (state, action) => {
      state.borrows = action.payload;
    });
  },
});

export const borrowActions = borrowSlice.actions;
export const selectBook = (state: RootState) => state.book;

export default borrowSlice.reducer;