import { AnyAction, configureStore, EnhancedStore, ThunkMiddleware } from '@reduxjs/toolkit'
import axios from 'axios'
import reducer, { BookState, fetchQueryBooks } from './book'

describe('book reducer', () => {
  let store: EnhancedStore<
  { book: BookState },
  AnyAction,
  [ThunkMiddleware<{ book: BookState }, AnyAction, undefined>]
  >
  const fakeBook = {
    id: 1,
    title: 'BOOK_TEST_TITLE',
    author: 'BOOK_TEST_AUTHOR',
    tags: ['BOOK_TEST_TAG_1', 'BOOK_TEST_TAG_2'],
    brief: 'BOOK_TEST_BRIEF'
  }
  beforeAll(() => {
    store = configureStore({ reducer: { book: reducer } })
  })
  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      books: [],
      selectedBook: null
    })
  })
  it('should handle fetchQueryBooks', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: [fakeBook] })
    await store.dispatch(fetchQueryBooks({ title: 'BOOK_TEST_TITLE' }))
    expect(store.getState().book.books).toEqual([fakeBook])
  })
})
