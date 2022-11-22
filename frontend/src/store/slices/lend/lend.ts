import axios from 'axios'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../..'
import { BookType } from '../book/book'
import { BorrowType } from '../borrow/borrow'
import { UserType } from '../user/user'

/*
 * Type definitions
 */

export interface ImageType {
  id: number
  image: string
}

export interface PostImageType {
  lend_id: number
  image_id: number
  image: string
}

export interface LendType {
  id: number
  book: BookType['id']
  book_info: Omit<BookType, 'id'>
  owner: UserType['id']
  owner_username: UserType['username']
  images: ImageType[]
  questions: string[]
  cost: number
  additional: string
  status: BorrowType | string | null
};

export interface LendState {
  lends: LendType[]
  userLends: LendType[]
  selectedLend: LendType | null
};

/*
 * Async thunks
 */

export const fetchQueryLends = createAsyncThunk(
  'lend/fetchQueryLends',
  async (params: { title?: string, author?: string, tag?: string[] }) => {
    const response = await axios.get<LendType[]>('/api/lend/', { params })
    return response.data
  }
)

export const createLend = createAsyncThunk(
  'lend/createLend',
  async (data: Omit<LendType, 'id' | 'status' | 'images'>, { dispatch }) => {
    const response = await axios.post('/api/lend/', data)
    dispatch(lendActions.addLend(response.data))
    return response.data
  }
)

export const postImage = createAsyncThunk(
  'lend/postImage',
  async (data: { image: File, id: number }, { dispatch }) => {
    const formData = new FormData()
    formData.append('image', data.image)
    formData.append('lend_id', String(data.id))
    const response = await axios.post('/api/lend/image/', formData)
    dispatch(lendActions.addImage(response.data))
    return response.data
  }
)

export const deleteImage = createAsyncThunk(
  'lend/postImage',
  async (data: { image_id: number }, { dispatch }) => {
    const response = await axios.delete(`/api/lend/image/${data.image_id}/`)
    dispatch(lendActions.deleteImage(response.data))
  }
)

export const fetchLend = createAsyncThunk(
  'lend/fetchLend',
  async (id: LendType['id']) => {
    const response = await axios.get(`/api/lend/${id}/`)
    return response.data
  }
)

export const updateLend = createAsyncThunk(
  'lend/updateLend',
  async (lend: Omit<LendType, 'status' | 'images'>, { dispatch }) => {
    const { id, ...data } = lend
    const response = await axios.put(`/api/lend/${id}/`, data)
    dispatch(lendActions.updateLend(response.data))
    return response.data
  }
)

export const deleteLend = createAsyncThunk(
  'lend/deleteLend',
  async (id: LendType['id'], { dispatch }) => {
    await axios.delete(`/api/lend/${id}/`)
    dispatch(lendActions.deleteLend(id))
  }
)

export const fetchUserLends = createAsyncThunk(
  'lend/fetchUserLend',
  async () => {
    const response = await axios.get<LendType[]>('/api/lend/user/')
    return response.data
  }
)

/*
 * Lend reducer
 */

const initialState: LendState = {
  lends: [],
  userLends: [],
  selectedLend: null
}

export const lendSlice = createSlice({
  name: 'lend',
  initialState,
  reducers: {
    addLend: (
      state,
      action: PayloadAction<LendType>
    ) => {
      const newLend: LendType = { ...action.payload }
      state.lends.push(newLend)
      state.selectedLend = newLend
    },
    updateLend: (
      state,
      action: PayloadAction<LendType>
    ) => {
      state.lends = state.lends.map(
        lend => (lend.id === action.payload.id) ? action.payload : lend
      )
    },
    deleteLend: (
      state,
      action: PayloadAction<LendType['id']>
    ) => {
      state.lends = state.lends.filter(
        lend => lend.id !== action.payload
      )
      state.selectedLend = null
    },
    addImage: (
      state,
      action: PayloadAction<PostImageType>
    ) => {
      const newImage: PostImageType = { ...action.payload }
      const lend = state.lends.find(lend => lend.id === newImage.lend_id)
      if (lend) {
        lend.images.push({ id: newImage.image_id, image: newImage.image })
      }
      if (state.selectedLend?.id === newImage.lend_id) {
        state.selectedLend.images.push({ id: newImage.image_id, image: newImage.image })
      }
    },
    deleteImage: (
      state,
      action: PayloadAction<Omit<PostImageType, 'image'>>
    ) => {
      const deletedImage: Omit<PostImageType, 'image'> = { ...action.payload }
      const lend = state.lends.find(lend => lend.id === deletedImage.lend_id)
      if (lend) {
        lend.images = lend.images.filter(image => image.id !== deletedImage.image_id)
      }
      if (state.selectedLend?.id === deletedImage.lend_id) {
        state.selectedLend.images = state.selectedLend.images.filter(image => image.id !== deletedImage.image_id)
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchQueryLends.fulfilled, (state, action) => {
      state.lends = action.payload
    })
    builder.addCase(fetchLend.fulfilled, (state, action) => {
      state.selectedLend = action.payload
    })
    builder.addCase(createLend.rejected, (_state, action) => {
      console.error(action.error)
    })
    builder.addCase(fetchUserLends.fulfilled, (state, action) => {
      state.userLends = action.payload
    })
  }
})

export const lendActions = lendSlice.actions
export const selectLend = (state: RootState) => state.lend

export default lendSlice.reducer
