import { AnyAction, configureStore, EnhancedStore, ThunkMiddleware } from '@reduxjs/toolkit'
import axios from 'axios'
import reducer, { RoomState, fetchUserRooms, createRoom } from './room'

describe('room reducer', () => {
  let store: EnhancedStore<{ room: RoomState }, AnyAction, [ThunkMiddleware<{ room: RoomState }, AnyAction, undefined>]>
  const fakeLendRoom = {
    id: 1,
    lend_id: 2,
    lender: 3,
    lender_username: 'ROOM_LEND_TEST_LENDER_USERNAME',
    borrower: 4,
    borrower_username: 'ROOM_LEND_TEST_BORROWER_USERNAME'
  }
  const fakeBorrowRoom = {
    id: 5,
    lend_id: 6,
    lender: 7,
    lender_username: 'ROOM_BORROW_TEST_LENDER_USERNAME',
    borrower: 7,
    borrower_username: 'ROOM_BORROW_TEST_BORROWER_USERNAME'
  }
  beforeAll(() => {
    store = configureStore({ reducer: { room: reducer } })
  })
  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      rooms_lend: [],
      rooms_borrow: []
    })
  })
  it('should handle fetchQueryRooms', async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: {
        rooms_lend: [fakeLendRoom],
        rooms_borrow: [fakeBorrowRoom]
      }
    })
    await store.dispatch(fetchUserRooms())
    expect(store.getState().room.rooms_lend).toEqual([fakeLendRoom])
    expect(store.getState().room.rooms_borrow).toEqual([fakeBorrowRoom])
  })
  it('should handle createRoom', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ data: fakeBorrowRoom })
    const result = await store.dispatch(
      createRoom(fakeBorrowRoom)
    )
    expect(result.type).toBe(`${createRoom.typePrefix}/fulfilled`)
    expect(store.getState().room.rooms_borrow.length).toEqual(2)
  })
  it('should handle createRoom error', async () => {
    const mockConsole = jest.fn()
    window.console.error = mockConsole
    jest.spyOn(axios, 'post').mockRejectedValue({ data: null })
    const result = await store.dispatch(
      createRoom(fakeLendRoom)
    )
    expect(result.type).toBe(`${createRoom.typePrefix}/rejected`)
  })
})
