import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import { RootState } from "../..";
import { UserType } from "../user/user";


/*
 * Type definitions
 */

export interface BorrowType {
  id: number;
  borrower: UserType;
  book_borrowed: number;
  active: boolean;
  lend_start_time: Date;
  lend_end_time: Date | null;
};

export interface BorrowState {
  userBorrows: BorrowType[];
  selectedBorrow: BorrowType | null;
};


/*
 * Async thunks
 */

export const createBorrow = createAsyncThunk(
  "borrow/createBorrow",
  async (data: Omit<BorrowType, "id">, { dispatch }) => {
    const response = await axios.post("/api/borrow/", data);
    dispatch(borrowActions.addBorrow({
      ...response.data,
      lend_end_time: response.data.lend_end_time ?? null,
    }));
  }
);

export const updateBorrow = createAsyncThunk(
  "borrow/updateBorrow",
  async (borrow: BorrowType, { dispatch }) => {
    const { id, ...data } = borrow;
    await axios.put(`/api/borrow/${id}/`, data);
    dispatch(borrowActions.updateBorrow(borrow));
  }
);

export const fetchUserBorrows = createAsyncThunk(
  "borrow/fetchUserBorrows",
  async () => {
    const response = await axios.get<BorrowType[]>("/api/borrow/user/");
    return response.data.map(borrow => ({
      ...borrow,
      lend_end_time: borrow.lend_end_time ?? null,
    }));
  }
);


/*
 * Borrow reducer
 */

const initialState: BorrowState = {
  userBorrows: [],
  selectedBorrow: null,
};

export const borrowSlice = createSlice({
  name: "borrow",
  initialState,
  reducers: {
    addBorrow: (
      state,
      action: PayloadAction<BorrowType>
    ) => {
      const newBorrow: BorrowType = { ...action.payload };
      state.userBorrows.push(newBorrow);
      state.selectedBorrow = newBorrow;
    },
    updateBorrow: (
      state,
      action: PayloadAction<BorrowType>
    ) => {
      state.userBorrows = state.userBorrows.map(
        borrow => (borrow.id === action.payload.id) ? action.payload : borrow
      );
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserBorrows.fulfilled, (state, action) => {
      state.userBorrows = action.payload;
    });
    builder.addCase(createBorrow.rejected, (_state, action) => {
      console.error(action.error);
    })
  },
});

export const borrowActions = borrowSlice.actions;
export const selectBorrow = (state: RootState) => state.borrow;

export default borrowSlice.reducer;