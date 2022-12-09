import { AnyAction, configureStore, EnhancedStore, ThunkMiddleware } from '@reduxjs/toolkit'
import { waitFor } from '@testing-library/react'
import axios from 'axios'
import reducer, { UserState, fetchTags, updateTag, fetchWatch, fetchRecommend, toggleWatch, requestSignup, requestLogout, requestLogin, errorPrefix } from './user'

describe('user reducer', () => {
  let store: EnhancedStore<{ user: UserState }, AnyAction, [ThunkMiddleware<{ user: UserState }, AnyAction, undefined>]>
  const fakeTag = 'USER_TEST_TAG'
  const fakeRecommend = {
    is_queued: false,
    is_outdated: false,
    enqueued: false,
    recommend_list: []
  }
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
  const fakeUser = {
    id: 1,
    username: 'USER_TEST_USERNAME'
  }
  beforeAll(() => {
    store = configureStore({ reducer: { user: reducer } })
  })
  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      count: 0,
      next: null,
      prev: null,
      currentUser: null,
      subscribed_tags: [],
      watch_list: [],
      recommend: {
        is_queued: false,
        is_outdated: false,
        enqueued: false,
        recommend_list: []
      }
    })
  })
  it('should handle fetchTags', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: [fakeTag] })
    await store.dispatch(fetchTags())
    expect(store.getState().user.subscribed_tags).toEqual([fakeTag])
  })
  it('should handle updateTag (delete)', async () => {
    jest.spyOn(axios, 'put').mockResolvedValue({
      data: {
        created: false,
        tag: fakeTag
      }
    })
    await store.dispatch(updateTag({ tag: fakeTag }))
    await waitFor(() => expect(store.getState().user.subscribed_tags.length).toEqual(0))
  })
  it('should handle updateTag (create)', async () => {
    jest.spyOn(axios, 'put').mockResolvedValue({
      data: {
        created: true,
        tag: 'test-tag'
      }
    })
    await store.dispatch(updateTag({ tag: fakeTag }))
    await waitFor(() => expect(store.getState().user.subscribed_tags.length).toEqual(1))
  })
  it('should handle fetchWatch', async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [fakeLend]
      }
    })
    await store.dispatch(fetchWatch())
    expect(store.getState().user.watch_list).toEqual([fakeLend])
  })
  it('should handle toggleWatch (delete)', async () => {
    jest.spyOn(axios, 'put').mockResolvedValue({
      data: {
        created: false,
        lend_info: fakeLend
      }
    })
    await store.dispatch(toggleWatch({ lend_id: fakeLend.id }))
    await waitFor(() => expect(store.getState().user.watch_list.length).toEqual(0))
  })
  it('should handle toggleWatch (create)', async () => {
    jest.spyOn(axios, 'put').mockResolvedValue({
      data: {
        created: true,
        lend_info: fakeLend
      }
    })
    await store.dispatch(toggleWatch({ lend_id: fakeLend.id }))
    await waitFor(() => expect(store.getState().user.watch_list.length).toEqual(1))
  })
  it('should handle fetchRecommend', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: fakeRecommend })
    await store.dispatch(fetchRecommend())
    expect(store.getState().user.recommend.recommend_list).toEqual([])
  })
  it('should handle requestSignup', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        token: true,
        ...fakeUser
      }
    })
    await store.dispatch(requestSignup({
      username: 'USER_TEST_USERNAME',
      password: 'USER_TEST_PASSWORD'
    }))
    expect(store.getState().user.currentUser?.username).toEqual('USER_TEST_USERNAME')
  })
  it('should handle requestLogout', async () => {
    await store.dispatch(requestLogout())
    expect(store.getState().user.currentUser).toEqual(null)
  })
  it('should handle requestLogin', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        token: true,
        ...fakeUser
      }
    })
    await store.dispatch(requestLogin({
      username: 'USER_TEST_USERNAME',
      password: 'USER_TEST_PASSWORD'
    }))
    expect(store.getState().user.currentUser?.username).toEqual('USER_TEST_USERNAME')
  })
  it('should handle requestSignup error', async () => {
    const mockConsole = jest.fn()
    window.console.error = mockConsole
    jest.spyOn(axios, 'post').mockRejectedValue(new Error(errorPrefix(409)))
    const result = await store.dispatch(requestSignup({
      username: 'USER_TEST_USERNAME',
      password: 'USER_TEST_PASSWORD'
    }))
    expect(result.type).toBe(`${requestSignup.typePrefix}/rejected`)
    expect(mockConsole).toHaveBeenCalled()

    jest.spyOn(axios, 'post').mockRejectedValue({ data: null })
    const result2 = await store.dispatch(requestSignup({
      username: 'USER_TEST_USERNAME',
      password: 'USER_TEST_PASSWORD'
    }))
    expect(result2.type).toBe(`${requestSignup.typePrefix}/rejected`)
    expect(mockConsole).toHaveBeenCalledTimes(2)

    jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        token: false,
        ...fakeUser
      }
    })
    await store.dispatch(requestSignup({
      username: 'USER_TEST_USERNAME',
      password: 'USER_TEST_PASSWORD'
    }))
    expect(mockConsole).toHaveBeenCalledTimes(2)
  })
  it('should handle requestLogin error', async () => {
    const mockConsole = jest.fn()
    window.console.error = mockConsole
    jest.spyOn(axios, 'post').mockRejectedValue(new Error(errorPrefix(4)))
    const result = await store.dispatch(requestLogin({
      username: 'USER_TEST_USERNAME',
      password: 'USER_TEST_PASSWORD'
    }))
    expect(result.type).toBe(`${requestLogin.typePrefix}/rejected`)
    expect(mockConsole).toHaveBeenCalled()

    jest.spyOn(axios, 'post').mockRejectedValue({ data: null })
    const result2 = await store.dispatch(requestLogin({
      username: 'USER_TEST_USERNAME',
      password: 'USER_TEST_PASSWORD'
    }))
    expect(result2.type).toBe(`${requestLogin.typePrefix}/rejected`)
    expect(mockConsole).toHaveBeenCalledTimes(2)

    jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        token: false,
        ...fakeUser
      }
    })
    await store.dispatch(requestLogin({
      username: 'USER_TEST_USERNAME',
      password: 'USER_TEST_PASSWORD'
    }))
    expect(mockConsole).toHaveBeenCalledTimes(2)
  })
  it('should handle updateTag error (not 404)', async () => {
    console.error = jest.fn()
    globalThis.alert = jest.fn()
    jest.spyOn(axios, 'put').mockRejectedValue(new Error('mock'))
    await store.dispatch(updateTag({ tag: fakeTag }))
    await waitFor(() => expect(console.error).toHaveBeenCalled())
  })
})
