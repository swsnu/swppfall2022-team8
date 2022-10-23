import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import { RootState } from "../..";
import { BookType } from "../book/book";
import { UserType } from "../user/user";


/*
 * Type definitions
 */

export interface LendType {
  id: number;
  book: BookType["id"];
  book_info: Omit<BookType, "id">;
  owner: UserType;
  questions: string[];
  cost: number;
  additional: number;
  status: string | null;
};

export interface LendState {
  lends: LendType[];
  userLends: LendType[];
  selectedLend: LendType | null;
};


/*
 * Async thunks
 */

export const fetchQueryLends = createAsyncThunk(
  "lend/fetchQueryLends",
  async (data: { title?: string, tag?: string, author?: string }) => {
    const response = await axios.get<LendType[]>("/api/lend/", { params: data });
    return response.data;
  }
);

export const createLend = createAsyncThunk(
  "lend/createLend",
  async (data: Omit<LendType, "id" | "status">, { dispatch }) => {
    const response = await axios.post("/api/lend/", data);
    dispatch(lendActions.addLend(response.data));
  }
);

export const fetchLend = createAsyncThunk(
  "lend/fetchLend",
  async (id: LendType["id"]) => {
    const response = await axios.get(`/api/lend/${id}/`);
    return response.data ?? null;
  }
);

export const updateLend = createAsyncThunk(
  "lend/updateLend",
  async (lend: LendType, { dispatch }) => {
    const { id, ...data } = lend;
    await axios.put(`/api/lend/${id}/`, data);
    dispatch(lendActions.updateLend(lend));
  }
);

export const deleteLend = createAsyncThunk(
  "lend/deleteLend",
  async (id: LendType["id"], { dispatch }) => {
    await axios.delete(`/api/lend/${id}/`);
    dispatch(lendActions.deleteLend(id));
  }
);

export const fetchUserLends = createAsyncThunk(
  "lend/fetchUserLend",
  async () => {
    const response = await axios.get<LendType[]>("/api/lend/user/");
    return response.data;
  }
);


/*
 * Lend reducer
 */

const initialState: LendState = {
  lends: [],
  userLends: [],
  selectedLend: null,
};

export const lendSlice = createSlice({
  name: "lend",
  initialState,
  reducers: {
    addLend: (
      state,
      action: PayloadAction<LendType>
    ) => {
      const newLend: LendType = { ...action.payload };
      state.lends.push(newLend);
      state.selectedLend = newLend;
    },
    updateLend: (
      state,
      action: PayloadAction<LendType>
    ) => {
      state.lends = state.lends.map(
        lend => (lend.id === action.payload.id) ? action.payload : lend
      );
    },
    deleteLend: (
      state,
      action: PayloadAction<LendType["id"]>
    ) => {
      state.lends = state.lends.filter(
        lend => lend.id !== action.payload
      );
      state.selectedLend = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchQueryLends.fulfilled, (state, action) => {
      state.lends = action.payload;
    });
    builder.addCase(fetchLend.fulfilled, (state, action) => {
      state.selectedLend = action.payload;
    });
    builder.addCase(createLend.rejected, (_state, action) => {
      console.error(action.error);
    });
    builder.addCase(fetchUserLends.fulfilled, (state, action) => {
      state.userLends = action.payload;
    })
  }
});

export const lendActions = lendSlice.actions;
export const selectLend = (state: RootState) => state.lend;

export default lendSlice.reducer;