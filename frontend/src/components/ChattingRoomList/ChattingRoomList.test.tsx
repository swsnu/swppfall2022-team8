import { fireEvent, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { act } from 'react-dom/test-utils'
import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import ChattingRoomList from './ChattingRoomList'

const fakeLender = {
  id: 1,
  username: 'lender_test_username'
}

const fakeBorrower = {
  id: 2,
  username: 'borrower_test_username'
}

const fakeThirdParty = {
  id: 7,
  username: 'third_party_test_username'
}

const fakeRoom = {
  id: 3,
  lend_id: 4,
  lender: fakeLender.id,
  lender_username: fakeLender.username,
  borrower: fakeBorrower.id,
  borrower_username: fakeBorrower.username,
  questions: ['ROOMLIST_TEST_QUESTION'],
  answers: ['ROOMLIST_TEST_ANSWER']
}

const fakeRoomThirdParty = {
  id: 8,
  lend_id: 4,
  lender: fakeLender.id,
  lender_username: fakeLender.username,
  borrower: fakeThirdParty.id,
  borrower_username: fakeBorrower.username,
  questions: ['ROOMLIST_TEST_THIRD_QUESTION'],
  answers: ['ROOMLIST_TEST_THIRD_ANSWER']
}

const fakeCursor = 'fakeCursor'

const preloadedState: RootState = rootInitialState

const mockEnterRoom = jest.fn()

describe('<ChattingRoomList />', () => {
  it('should handle enterRoom', async () => {
    // given
    renderWithProviders(
      <ChattingRoomList
        enterRoom={mockEnterRoom}
      />,
      {
        preloadedState: {
          ...preloadedState,
          user: {
            ...preloadedState.user,
            currentUser: fakeBorrower
          },
          room: {
            ...preloadedState.room,
            rooms: [fakeRoom],
            next: fakeCursor
          }
        }
      }
    )
    const button = screen.getAllByRole('heading')[0]

    // when
    fireEvent.click(button)

    // then
    await waitFor(() => expect(mockEnterRoom).toHaveBeenCalledWith(fakeRoom))
  })
  it('should handle loadRoom', async () => {
    // given
    axios.get = jest.fn().mockResolvedValue({
      data: {
        next: null,
        previous: 'fakeCursor',
        results: [fakeRoomThirdParty]
      }
    })
    const { store } = renderWithProviders(
      <ChattingRoomList
        enterRoom={mockEnterRoom}
      />,
      {
        preloadedState: {
          ...preloadedState,
          user: {
            ...preloadedState.user,
            currentUser: fakeLender
          },
          room: {
            ...preloadedState.room,
            rooms: [fakeRoom],
            next: fakeCursor
          }
        }
      }
    )

    // when
    await act(() => {
      const button = screen.getAllByRole('button')[0]
      fireEvent.click(button)
    })

    // then
    await waitFor(() => expect(store.getState().room.rooms.length).toEqual(2))
  })
})
