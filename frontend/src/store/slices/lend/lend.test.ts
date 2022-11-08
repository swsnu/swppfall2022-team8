import { AnyAction, configureStore, EnhancedStore, ThunkMiddleware } from '@reduxjs/toolkit'
import axios from 'axios'
import reducer, { LendState, fetchQueryLends } from './lend'

describe('lend reducer', () => {
  let store: EnhancedStore<
  { lend: LendState },
  AnyAction,
  [ThunkMiddleware<{ lend: LendState }, AnyAction, undefined>]
  >
  const fakeLend = {
    id: 2,
    book: 1,
    book_info: {
      title: 'LEND_TEST_TITLE',
      author: 'LEND_TEST_AUTHOR',
      tags: ['LEND_TEST_TAG_1', 'LEND_TEST_TAG_2'],
      brief: 'LEND_TEST_BRIEF'
    },
    owner: 3,
    owner_username: 'LEND_TEST_OWNER_USERNAME',
    questions: [
      'LEND_TEST_QUESTION_1',
      'LEND_TEST_QUESTION_2'
    ],
    cost: 3000,
    additional: 'LEND_TEST_ADDITIONAL',
    status: null
  }
  beforeAll(() => {
    store = configureStore({ reducer: { lend: reducer } })
  })
  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      lends: [],
      userLends: [],
      selectedLend: null
    })
  })
  it('should handle fetchQueryLends', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: [fakeLend] })
    await store.dispatch(fetchQueryLends({ title: 'LEND_TEST_TITLE' }))
    expect(store.getState().lend.lends).toEqual([fakeLend])
  })
})
