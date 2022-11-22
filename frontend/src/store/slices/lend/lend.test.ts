import { AnyAction, configureStore, EnhancedStore, ThunkMiddleware } from '@reduxjs/toolkit'
import { waitFor } from '@testing-library/react'
import axios from 'axios'
import reducer, { LendState, fetchQueryLends, createLend, fetchLend, deleteLend, updateLend, fetchUserLends } from './lend'

describe('lend reducer', () => {
  let store: EnhancedStore<{ lend: LendState }, AnyAction, [ThunkMiddleware<{ lend: LendState }, AnyAction, undefined>]>
  const mockData = new FormData()
  const fakeLend = {
    id: 2,
    book: 1,
    book_info: {
      image: '',
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
  it('should handle createLend', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ data: fakeLend })
    const result = await store.dispatch(
      createLend(mockData)
    )
    expect(result.type).toBe(`${createLend.typePrefix}/fulfilled`)
    expect(store.getState().lend.lends.length).toEqual(2)
  })
  it('should handle fetchLend', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: fakeLend })
    await store.dispatch(fetchLend(fakeLend.id))
    expect(store.getState().lend.selectedLend).toEqual(fakeLend)
  })
  it('should handle deleteLend', async () => {
    axios.delete = jest.fn().mockResolvedValue({ data: null })
    await store.dispatch(deleteLend(fakeLend.id))
    expect(store.getState().lend.lends).toEqual([])
  })
  it('should handle updateLend', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ data: fakeLend })
    await store.dispatch(
      createLend(mockData)
    )
    jest.spyOn(axios, 'post').mockResolvedValue({ data: { ...fakeLend, id: 3 } })
    await store.dispatch(
      createLend(mockData)
    )
    jest.spyOn(axios, 'put').mockResolvedValue({
      data: { ...fakeLend, additional: 'LEND_TEST_ADDITIONAL_CHNAGED' }
    })
    await store.dispatch(updateLend({ lendData: mockData, id: '0' }))
    await waitFor(() => expect(store.getState().lend.lends.find(lend => lend.id === fakeLend.id)?.additional).toEqual('LEND_TEST_ADDITIONAL_CHNAGED'))
  })
  it('should handle createLend error', async () => {
    const mockConsole = jest.fn()
    window.console.error = mockConsole
    jest.spyOn(axios, 'post').mockRejectedValue({ data: null })
    const result = await store.dispatch(
      createLend(mockData)
    )
    expect(result.type).toBe(`${createLend.typePrefix}/rejected`)
  })
  it('should handle fetchUserLends', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: [fakeLend] })
    await store.dispatch(fetchUserLends())
    expect(store.getState().lend.userLends).toEqual([fakeLend])
  })
})
