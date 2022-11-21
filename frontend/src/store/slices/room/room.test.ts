import { AnyAction, configureStore, EnhancedStore, ThunkMiddleware } from '@reduxjs/toolkit'
import axios from 'axios'
import reducer, { RoomState, fetchUserRooms, createRoom, fetchNextUserRooms } from './room'

describe('room reducer', () => {
  let store: EnhancedStore<{ room: RoomState }, AnyAction, [ThunkMiddleware<{ room: RoomState }, AnyAction, undefined>]>
  const fakeLendRoom = {
    id: 1,
    lend_id: 2,
    lender: 3,
    lender_username: 'ROOM_LEND_TEST_LENDER_USERNAME',
    borrower: 4,
    borrower_username: 'ROOM_LEND_TEST_BORROWER_USERNAME',
    questions: ['ROOM_LEND_TEST_QUESTION'],
    answers: ['ROOM_LEND_TEST_ANSWER']
  }
  const fakeBorrowRoom = {
    id: 5,
    lend_id: 6,
    lender: 7,
    lender_username: 'ROOM_BORROW_TEST_LENDER_USERNAME',
    borrower: 7,
    borrower_username: 'ROOM_BORROW_TEST_BORROWER_USERNAME',
    questions: ['ROOM_BORROW_TEST_QUESTION'],
    answers: ['ROOM_BORROW_TEST_ANSWER']
  }
  const fakeCursor = 'fakeCursor'
  beforeAll(() => {
    store = configureStore({ reducer: { room: reducer } })
  })
  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      next: null,
      prev: null,
      rooms: [],
      selectedRoom: null
    })
  })
  it('should handle fetchUserRooms', async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: {
        next: fakeCursor,
        previous: null,
        results: [fakeLendRoom]
      }
    })
    await store.dispatch(fetchUserRooms())
    expect(store.getState().room.rooms).toEqual([fakeLendRoom])
    expect(store.getState().room.next).toEqual(fakeCursor)
    expect(store.getState().room.prev).toEqual(null)
  })
  it('should handle fetchNextUserRooms', async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: {
        next: null,
        previous: fakeCursor,
        results: [fakeBorrowRoom]
      }
    })
    await store.dispatch(fetchNextUserRooms())
    expect(store.getState().room.rooms).toEqual([fakeLendRoom, fakeBorrowRoom])
    expect(store.getState().room.next).toEqual(null)
    expect(store.getState().room.prev).toEqual(fakeCursor)
  })
  it('should handle createRoom', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ data: fakeLendRoom })
    await store.dispatch(createRoom({
      lend_id: fakeLendRoom.lend_id,
      answers: fakeLendRoom.answers
    }))
    expect(store.getState().room.selectedRoom).toEqual(fakeLendRoom)
  })
  it('should handle createRoom error', async () => {
    console.error = jest.fn()
    jest.spyOn(axios, 'post').mockRejectedValue({ data: null })
    await store.dispatch(createRoom(fakeLendRoom))
    expect(console.error).toBeCalled()
  })
})
