import { AnyAction, configureStore, EnhancedStore, ThunkMiddleware } from '@reduxjs/toolkit'
import { waitFor } from '@testing-library/react'
import axios from 'axios'
import reducer, { BookState, createBook, deleteBook, fetchBook, fetchQueryBooks, updateBook } from './book'

describe('book reducer', () => {
  let store: EnhancedStore<
    { book: BookState },
    AnyAction,
    [ThunkMiddleware<{ book: BookState }, AnyAction, undefined>]
  >
  const fakeBook1 = {
    id: 1,
    title: 'test-title-1',
    author: 'test-author-1',
    tags: ['test-tag-1'],
    brief: 'test-brief-1'
  }
  const fakeBook2 = {
    id: 1,
    title: 'test-title-changed',
    author: 'test-author-changed',
    tags: ['test-tag-changed'],
    brief: 'test-brief-changed'
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
    axios.get = jest.fn().mockResolvedValue({ data: [fakeBook1] })
    await store.dispatch(fetchQueryBooks({ title: 'BOOK_TEST_TITLE' }))
    expect(store.getState().book.books).toEqual([fakeBook1])
  })
  it('should handle createBook', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ data: fakeBook1 })
    const result = await store.dispatch(
      createBook({
        title: 'test-title-1',
        author: 'test-author-1',
        tags: ['test-tag-1'],
        brief: 'test-brief-1'
      })
    )
    expect(result.type).toBe(`${createBook.typePrefix}/fulfilled`)
    expect(store.getState().book.books.length).toEqual(2)
  })
  it('should handle fetchBook', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: fakeBook1 })
    await store.dispatch(fetchBook(1))
    expect(store.getState().book.selectedBook).toEqual(fakeBook1)
  })
  it('should handle deleteBook', async () => {
    axios.delete = jest.fn().mockResolvedValue({ data: null })
    await store.dispatch(deleteBook(1))
    expect(store.getState().book.books).toEqual([])
  })
  it('should handle updateBook', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ data: fakeBook1 })
    await store.dispatch(
      createBook({
        title: 'test-title-1',
        author: 'test-author-1',
        tags: ['test-tag-1'],
        brief: 'test-brief-1'
      })
    )
    jest.spyOn(axios, 'post').mockResolvedValue({ data: { ...fakeBook1, id: 2 } })
    await store.dispatch(
      createBook({
        title: 'test-title-1',
        author: 'test-author-1',
        tags: ['test-tag-1'],
        brief: 'test-brief-1'
      })
    )
    jest.spyOn(axios, 'put').mockResolvedValue({
      data: fakeBook2
    })
    await store.dispatch(updateBook(fakeBook2))
    await waitFor(() => expect(store.getState().book.books.find(book => book.id === fakeBook1.id)?.title).toEqual(fakeBook2.title))
  })
  it('should handle createBook error', async () => {
    const mockConsole = jest.fn()
    window.console.error = mockConsole
    jest.spyOn(axios, 'post').mockRejectedValue({ data: null })
    const result = await store.dispatch(
      createBook({
        title: 'test-title-1',
        author: 'test-author-1',
        tags: ['test-tag-1'],
        brief: 'test-brief-1'
      })
    )
    expect(result.type).toBe(`${createBook.typePrefix}/rejected`)
  })
})
