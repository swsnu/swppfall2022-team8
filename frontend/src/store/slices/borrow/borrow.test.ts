import { AnyAction, configureStore, EnhancedStore, ThunkMiddleware } from '@reduxjs/toolkit'
import { waitFor } from '@testing-library/react'
import axios from 'axios'
import reducer, { BorrowState, createBorrow, fetchUserBorrows, toggleBorrowStatus } from './borrow'

describe('borrow reducer', () => {
  let store: EnhancedStore<
    { borrow: BorrowState },
    AnyAction,
    [ThunkMiddleware<{ borrow: BorrowState }, AnyAction, undefined>]
  >
  const fakeBorrow = {
    id: 1,
    borrower: 2,
    borrower_username: 'BORROW_TEST_USERNAME',
    lend_id: 3,
    active: true,
    lend_start_time: '1970-01-01T00:00:00.000Z', // serialized Date object
    lend_end_time: null
  }
  beforeAll(() => {
    store = configureStore({ reducer: { borrow: reducer } })
  })
  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      userBorrows: [],
      selectedBorrow: null
    })
  })
  it('should handle fetchUserBorrows', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: [fakeBorrow] })
    await store.dispatch(fetchUserBorrows())
    expect(store.getState().borrow.userBorrows).toEqual([fakeBorrow])
  })
  it('should handle createBorrow', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ data: fakeBorrow })
    const result = await store.dispatch(
      createBorrow({ borrower: 2, lend_id: 3 })
    )
    expect(result.type).toBe(`${createBorrow.typePrefix}/fulfilled`)
    expect(store.getState().borrow.selectedBorrow?.borrower_username).toEqual(fakeBorrow.borrower_username)
  })
  it('should handle toggleBorrowStatus', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ data: { ...fakeBorrow, id: 2 } })
    await store.dispatch(
      createBorrow({ borrower: 2, lend_id: 3 })
    )
    jest.spyOn(axios, 'put').mockResolvedValue({
      data: {
        id: 2,
        borrower: 2,
        borrower_username: 'BORROW_TEST_USERNAME_CHANGED',
        lend_id: 3,
        active: false,
        lend_start_time: '1970-01-01T00:00:00.000Z', // serialized Date object
        lend_end_time: null
      }
    })
    await store.dispatch(toggleBorrowStatus(2))
    await waitFor(() => expect(store.getState().borrow.userBorrows.find(borrow => borrow.id === 2)?.borrower_username).toEqual('BORROW_TEST_USERNAME_CHANGED'))
  })
  it('should handle createBorrow error', async () => {
    const mockConsole = jest.fn()
    window.console.error = mockConsole
    jest.spyOn(axios, 'post').mockRejectedValue({ data: null })
    const result = await store.dispatch(
      createBorrow({ borrower: 2, lend_id: 3 })
    )
    expect(result.type).toBe(`${createBorrow.typePrefix}/rejected`)
  })
})
