import { AnyAction, configureStore, EnhancedStore, ThunkMiddleware } from '@reduxjs/toolkit'
import axios from 'axios'
import reducer, { BorrowState, fetchUserBorrows } from './borrow'

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
})
