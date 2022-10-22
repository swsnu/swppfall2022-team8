import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../..";


/*
 * Type definitions
 */

export interface BookType {
  id: number;
  title: string;
  author: string;
  tags: string[];
  brief: string;
};

export interface BookState {
  books: BookType[];
  selectedBook: BookType | null;
};


/*
 * Async thunks
 */

const initialState: BookState = {
  books: [],
  selectedBook: null,
};

export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {

  }
});

export const bookActions = bookSlice.actions;
export const selectBook = (state: RootState) => state.book;

export default bookSlice.reducer;