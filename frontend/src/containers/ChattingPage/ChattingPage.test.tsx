import axios from 'axios'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { Server } from 'mock-socket'

import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import ChattingPage, { ChatType } from './ChattingPage'
import { IProps as RoomListProps } from '../../components/ChattingRoomList/ChattingRoomList'
import { IProps as RoomProps } from '../../components/ChattingRoom/ChattingRoom'
import { IProps as RightMenuProps } from '../../components/ChattingRightMenu/ChattingRightMenu'

interface MessageType {
  command: string
  messages?: ChatType[]
  message?: ChatType[]
}

const fakeLender = {
  id: 1,
  username: 'lender_test_username'
}

const fakeBorrower = {
  id: 2,
  username: 'borrower_test_username'
}

const fakeRoom = {
  id: 3,
  lend_id: 4,
  lender: fakeLender.id,
  lender_username: fakeLender.username,
  borrower: fakeBorrower.id,
  borrower_username: fakeBorrower.username
}

const fakeLend = {
  id: 4,
  book: 5,
  book_info: {
    title: 'CHAT_TEST_TITLE',
    author: 'CHAT_TEST_AUTHOR',
    tags: ['CHAT_TEST_TAG_1', 'CHAT_TEST_TAG_2'],
    brief: 'CHAT_TEST_BRIEF'
  },
  owner: fakeLender.id,
  owner_username: fakeLender.username,
  questions: ['CHAT_TEST_QUESTION_1', 'CHAT_TEST_QUESTION_2'],
  cost: 3000,
  additional: 'CHAT_TEST_ADDITIONAL',
  status: null
}

const fakeBorrow = {
  id: 6,
  borrower: fakeBorrower.id,
  borrower_username: fakeBorrower.username,
  lend_id: 4,
  active: true,
  lend_start_time: '1970-01-01T00:00:00.000Z',
  lend_end_time: null
}

const spyNavBar = () => <p>NavBar</p>
const spyChattingRoomList = (props: RoomListProps) => {
  const otherUsername = {
    lend: fakeBorrower.username,
    borrow: fakeLender.username
  }
  return (
    <div data-testid='spyRoomList'>
      <button
        data-testid='spyRoomButton'
        onClick={() => props.clickRoomHandler(0, props.group)}
      >chat with {otherUsername[props.group]}</button>
    </div>
  )
}

const spyChattingRoom = (props: RoomProps) => (
  <div data-testid='spyRoom'>
    <div data-testid="spyChatBox">
      {props.chatList[0]?.content}
    </div>
    <input
      id="chat-input"
      type="text"
      value={props.chatInput}
      onChange={event => props.changeChatInput(event.target.value)}
    />
    <button
      type="button"
      onClick={() => props.clickSendChatHandler()}
    >Send chat</button>
  </div>
)
const spyChattingRightMenu = (props: RightMenuProps) => (
  <div data-testid='spyRightMenu'>
    {(() => {
      if (props.group === 'lend' && props.borrowable) {
        return (
          <button
            type="button"
            onClick={() => props.clickConfirmLendingHandler()}
          >Confirm lending</button>
        )
      } else if (props.group === 'lend' && props.borrowed) {
        return (
          <button
            type="button"
            onClick={() => props.clickConfirmReturnHandler()}
          >Confirm return</button>
        )
      } else {
        return <p>test-book-info</p>
      }
    })()}
  </div>
)

jest.mock('../../components/NavBar/NavBar', () => spyNavBar)
jest.mock('../../components/ChattingRoomList/ChattingRoomList', () => spyChattingRoomList)
jest.mock('../../components/ChattingRoom/ChattingRoom', () => spyChattingRoom)
jest.mock('../../components/ChattingRightMenu/ChattingRightMenu', () => spyChattingRightMenu)

const preloadedState: RootState = rootInitialState

describe('<ChattingPage />', () => {
  let mockServer: Server
  beforeEach(() => {
    /*
     * simple WebSocket echo server
     */
    mockServer = new Server('ws://localhost:8000/ws/chat/3/')
    mockServer.on('connection', socket => {
      socket.on('message', message => {
        if (typeof message !== 'string') {
          return
        }
        const data: MessageType = JSON.parse(message)
        if (data.command === 'list') {
          socket.send(JSON.stringify({
            command: 'list',
            messages: []
          }))
        } else if (data.command === 'create') {
          socket.send(JSON.stringify({
            command: 'create',
            message: {
              id: 1,
              author: fakeLender.id,
              author_username: fakeLender.username,
              content: data.message,
              timestamp: 'tmp'
            }
          }))
        }
      })
    })
  })
  afterEach(() => {
    mockServer.close()
  })
  it('should handle borrower use case + send a message', async () => {
    // given
    jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      const op = url.split('/')[2]
      const data = (op === 'room')
        ? { rooms_lend: [], rooms_borrow: [fakeRoom] }
        : fakeLend
      return Promise.resolve({ data })
    })
    const { container, unmount } = renderWithProviders(<ChattingPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeBorrower
        }
      }
    })

    // when
    const borrowRoomsButton = await screen.findByText('borrow rooms')
    await act(() => {
      fireEvent.click(borrowRoomsButton)
    })
    const roomButton = await screen.findByTestId('spyRoomButton')
    await act(() => {
      fireEvent.click(roomButton)
    })
    const chatInput = container.getElementsByTagName('input')[0]
    const sendButton = await screen.findByText('Send chat')
    await act(async () => {
      fireEvent.change(chatInput, { target: { value: 'CHAT_TEST_INPUT' } })
      fireEvent.click(sendButton)
    })
    const chatBox = await screen.findByTestId('spyChatBox')

    // then
    await waitFor(() => expect(chatBox.innerHTML).toEqual('CHAT_TEST_INPUT'))
    unmount()
  })
  it('should handle lender use case (confirm lending)', async () => {
    // given
    globalThis.alert = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      const op = url.split('/')[2]
      const data = (op === 'room')
        ? { rooms_lend: [fakeRoom], rooms_borrow: [] }
        : fakeLend
      return Promise.resolve({ data })
    })
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve({
      data: fakeBorrow
    }))
    jest.spyOn(axios, 'put').mockImplementation(() => Promise.resolve({
      data: {
        ...fakeBorrow,
        lend_end_time: '1970-01-01T00:00:00.001Z'
      }
    }))
    const { unmount } = renderWithProviders(<ChattingPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeLender
        }
      }
    })

    // when
    const lendRoomsButton = await screen.findByText('lend rooms')
    await act(() => {
      fireEvent.click(lendRoomsButton)
    })
    const roomButton = await screen.findByTestId('spyRoomButton')
    await act(() => {
      fireEvent.click(roomButton)
    })
    const confirmLendingButton = await screen.findByText('Confirm lending')
    await act(() => {
      fireEvent.click(confirmLendingButton)
    })

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Successfully lent'))
    unmount()
  })
  it('should handle lender use case (confirm return)', async () => {
    // given
    globalThis.alert = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      const op = url.split('/')[2]
      const data = (op === 'room')
        ? { rooms_lend: [fakeRoom], rooms_borrow: [] }
        : {
            ...fakeLend,
            status: fakeBorrow
          }
      return Promise.resolve({ data })
    })
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve({
      data: fakeBorrow
    }))
    jest.spyOn(axios, 'put').mockImplementation(() => Promise.resolve({
      data: {
        ...fakeBorrow,
        lend_end_time: '1970-01-01T00:00:00.001Z'
      }
    }))
    const { unmount } = renderWithProviders(<ChattingPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeLender
        }
      }
    })

    // when
    const lendRoomsButton = await screen.findByText('lend rooms')
    await act(() => {
      fireEvent.click(lendRoomsButton)
    })
    const roomButton = await screen.findByTestId('spyRoomButton')
    await act(() => {
      fireEvent.click(roomButton)
    })
    const confirmReturnButton = await screen.findByText('Confirm return')
    await act(() => {
      fireEvent.click(confirmReturnButton)
    })

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Successfully return'))
    unmount()
  })
})
