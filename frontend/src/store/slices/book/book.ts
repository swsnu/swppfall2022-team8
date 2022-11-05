import axios from 'axios'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../..'

/*
 * Type definitions
 */

export interface BookType {
  id: number
  title: string
  author: string
  tags: string[]
  brief: string
};

export interface BookState {
  books: BookType[]
  selectedBook: BookType | null
};

/*
 * Async thunks
 */

export const fetchQueryBooks = createAsyncThunk(
  'book/fetchQueryBooks',
  async (params: { title?: string, author?: string, tag?: string[] }) => {
    const response = await axios.get<BookType[]>('/api/book/', { params })
    return response.data
  }
)

export const createBook = createAsyncThunk(
  'book/createBook',
  async (data: Omit<BookType, 'id'>, { dispatch }) => {
    const response = await axios.post('/api/book/', data)
    dispatch(bookActions.addBook(response.data))
    return response.data
  }
)

export const fetchBook = createAsyncThunk(
  'book/fetchBook',
  async (id: BookType['id']) => {
    const response = await axios.get(`/api/book/${id}/`)
    return response.data ?? null
  }
)

export const updateBook = createAsyncThunk(
  'book/updateBook',
  async (book: BookType, { dispatch }) => {
    const { id, ...data } = book
    const response = await axios.put(`/api/book/${id}/`, data)
    dispatch(bookActions.updateBook(response.data))
    return response.data
  }
)

export const deleteBook = createAsyncThunk(
  'book/deleteBook',
  async (id: BookType['id'], { dispatch }) => {
    await axios.delete(`/api/book/${id}/`)
    dispatch(bookActions.deleteBook(id))
  }
)

/*
 * Book reducer
 */

const initialState: BookState = {
  books: [],
  selectedBook: null
}

export const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    addBook: (
      state,
      action: PayloadAction<BookType>
    ) => {
      const newBook = { ...action.payload }
      state.books.push(newBook)
      state.selectedBook = newBook
    },
    updateBook: (
      state,
      action: PayloadAction<BookType>
    ) => {
      state.books = state.books.map(
        book => (book.id === action.payload.id) ? action.payload : book
      )
    },
    deleteBook: (
      state,
      action: PayloadAction<BookType['id']>
    ) => {
      state.books = state.books.filter(
        book => book.id !== action.payload
      )
      state.selectedBook = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchQueryBooks.fulfilled, (state, action) => {
      state.books = action.payload
    })
    builder.addCase(fetchBook.fulfilled, (state, action) => {
      state.selectedBook = action.payload
    })
    builder.addCase(createBook.rejected, (_state, action) => {
      console.error(action.error)
    })
  }
})

export const bookActions = bookSlice.actions
export const selectBook = (state: RootState) => state.book

export default bookSlice.reducer
