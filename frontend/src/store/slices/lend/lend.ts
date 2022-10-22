import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../..";
import { BookType } from "../book/book";


/*
 * Type definitions
 */

export interface LendType {
  id: number;
  book: BookType;
  owner: number;
  questions: string[];
  cost: number;
  additional: number;
  status: boolean;
};

export interface LendState {
  lends: LendType[];
  selectedLend: LendType | null;
};


/*
 * Async thunks
 */

export const fetchQueryLends = createAsyncThunk(
  "borrow/fetchQueryLends",
  async (data: { title?: string, tags?: string, author?: string }) => {
    const response = await axios.get<LendType[]>("/api/lend/", { params: data });
    return response.data;
  }
);

const initialState: LendState = {
  lends: [],
  selectedLend: null,
};

export const lendSlice = createSlice({
  name: "lend",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    
  }
});

export const lendActions = lendSlice.actions;
export const selectBook = (state: RootState) => state.book;

export default lendSlice.reducer;