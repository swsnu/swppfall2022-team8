import { AnyAction, configureStore, EnhancedStore, ThunkMiddleware } from '@reduxjs/toolkit'
import axios from 'axios'
import reducer, { UserState, fetchTags } from './user'

describe('user reducer', () => {
  let store: EnhancedStore<
  { user: UserState },
  AnyAction,
  [ThunkMiddleware<{ user: UserState }, AnyAction, undefined>]
  >
  const fakeTag = 'USER_TEST_TAG'
  beforeAll(() => {
    store = configureStore({ reducer: { user: reducer } })
  })
  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      currentUser: null,
      subscribed_tags: [],
      watch_list: []
    })
  })
  it('should handle fetchQueryUsers', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: [fakeTag] })
    await store.dispatch(fetchTags())
    expect(store.getState().user.subscribed_tags).toEqual([fakeTag])
  })
})
