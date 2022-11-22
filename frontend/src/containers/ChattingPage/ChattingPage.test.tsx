import axios from 'axios'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { Server } from 'mock-socket'

import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import ChattingPage, { ChatRank, ChatType } from './ChattingPage'
import { IProps as RoomListProps } from '../../components/ChattingRoomList/ChattingRoomList'
import { IProps as RoomProps } from '../../components/ChattingRoom/ChattingRoom'
import { IProps as RightMenuProps } from '../../components/ChattingRightMenu/ChattingRightMenu'

interface MessageType {
  command: string
  user_id: number
  messages?: ChatType[]
  message?: ChatType[]
  rank?: ChatRank
  next: string | null
}

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
  questions: ['CHAT_TEST_QUESTION'],
  answers: ['CHAT_TEST_ANSWER']
}

const fakeRoomThirdParty = {
  id: 8,
  lend_id: 4,
  lender: fakeLender.id,
  lender_username: fakeLender.username,
  borrower: fakeThirdParty.id,
  borrower_username: fakeBorrower.username,
  questions: ['CHAT_TEST_THIRD_QUESTION'],
  answers: ['CHAT_TEST_THIRD_ANSWER']
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

const fakeChat: ChatType = {
  id: 6,
  author: 1,
  author_username: 'test-counterpart',
  content: 'test-chat',
  timestamp: 'test-timestamp',
  rank: 'chat'
}

const fakeCursor = 'fakeCursor'
const fakeChatInput = 'CHAT_TEST_INPUT'

const spyNavBar = () => <p>NavBar</p>
const spyChattingRoomList = (props: RoomListProps) => {
  return (
    <div data-testid='spyRoomList'>
      <button
        data-testid='spyRoomButton0'
        onClick={() => props.enterRoom(fakeRoom)}
      >chat0</button>
      <button
        data-testid='spyRoomButton1'
        onClick={() => props.enterRoom(fakeRoomThirdParty)}
      >chat1</button>
    </div>
  )
}

const spyChattingRoom = (props: RoomProps) => (
  <div data-testid='spyRoom'>
    <button
      type="button"
      onClick={() => props.loadMessage()}
    >loadMessage</button>
    <div data-testid="spyChatBox" id='chat-box'>
      {[...props.oldChatList, ...props.newChatList].map(chat => chat.content).join(',')}
    </div>
    <button
      type="button"
      onClick={() => props.sendMessage(fakeChatInput, 'chat')}
    >Send chat</button>
  </div>
)
const spyChattingRightMenu = (props: RightMenuProps) => (
  <div data-testid='spyRightMenu'>
    {(() => {
      if (props.borrowable) {
        return (
          <button
            type="button"
            onClick={() => props.clickConfirmLendingHandler()}
          >Confirm lending</button>
        )
      } else if (props.borrowed) {
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
        let testId = 6
        if (data.command === 'list') {
          socket.send(JSON.stringify({
            command: 'list',
            messages: [{ ...fakeChat, id: testId }],
            next: fakeCursor
          }))
          testId += 1
        } else if (data.command === 'create') {
          socket.send(JSON.stringify({
            command: 'create',
            message: {
              id: 1,
              author: data.user_id,
              author_username: 'test_username',
              content: data.message,
              timestamp: 'tmp',
              rank: data.rank
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
        ? { next: fakeCursor, previous: null, results: [fakeRoom] }
        : fakeLend
      return Promise.resolve({ data })
    })
    const { unmount } = renderWithProviders(<ChattingPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeBorrower
        }
      }
    })

    // when
    const roomButton = await screen.findByTestId('spyRoomButton0')
    await act(() => {
      fireEvent.click(roomButton)
    })
    const sendButton = await screen.findByText('Send chat')
    await act(async () => {
      fireEvent.click(sendButton)
    })

    // then
    const chatBox = await screen.findByTestId('spyChatBox')
    await waitFor(() => expect(chatBox.innerHTML).toEqual(fakeChat.content + ',' + fakeChatInput))
    unmount()
  })
  it('should handle lender use case (confirm lending)', async () => {
    // given
    globalThis.confirm = jest.fn().mockReturnValue(true)
    jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      const op = url.split('/')[2]
      const data = (op === 'room')
        ? { next: fakeCursor, previous: null, results: [fakeRoom] }
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
    const roomButton = await screen.findByTestId('spyRoomButton0')
    await act(() => {
      fireEvent.click(roomButton)
    })
    const confirmLendingButton = await screen.findByText('Confirm lending')
    await act(() => {
      fireEvent.click(confirmLendingButton)
    })

    // then
    await waitFor(() => expect(globalThis.confirm).toHaveBeenCalledWith('Are you sure you want to confirm lending?'))
    unmount()
  })
  it('should handle lender use case (confirm return)', async () => {
    // given
    globalThis.confirm = jest.fn().mockReturnValue(true)
    jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      const op = url.split('/')[2]
      const data = (op === 'room')
        ? { next: fakeCursor, previous: null, results: [fakeRoom] }
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
    renderWithProviders(<ChattingPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeLender
        }
      }
    })

    // when
    const roomButton = await screen.findByTestId('spyRoomButton0')
    await act(() => {
      fireEvent.click(roomButton)
    })
    const confirmReturnButton = await screen.findByText('Confirm return')
    await act(() => {
      fireEvent.click(confirmReturnButton)
    })

    // then
    await waitFor(() => expect(globalThis.confirm).toHaveBeenCalledWith('Are you sure you want to confirm return?'))
  })
  it('should do nothing if user clicks already selected room', async () => {
    // given
    jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      const op = url.split('/')[2]
      const data = (op === 'room')
        ? { next: fakeCursor, previous: null, results: [fakeRoom] }
        : {
            ...fakeLend,
            status: fakeBorrow
          }
      return Promise.resolve({ data })
    })
    renderWithProviders(<ChattingPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeLender
        }
      }
    })
    const roomButton = await screen.findByText('chat0')
    await act(() => {
      fireEvent.click(roomButton)
    })

    // when
    await act(() => {
      fireEvent.click(roomButton)
    })

    // then
    await waitFor(() => expect(axios.get).toBeCalledTimes(2))
  })
  it('should handle error on fetching lending information', async () => {
    // given
    globalThis.alert = jest.fn()
    console.error = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      const op = url.split('/')[2]
      if (op === 'room') {
        return Promise.resolve({ data: { rooms_lend: [fakeRoom], rooms_borrow: [] } })
      } else {
        return Promise.reject(new Error('mock'))
      }
    })
    renderWithProviders(<ChattingPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeLender
        }
      }
    })

    // when
    const roomButton = await screen.findByTestId('spyRoomButton0')
    await act(() => {
      fireEvent.click(roomButton)
    })

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Error on fetch lending information'))
  })
  it('should handle unexpected WebSocket Error', async () => {
    // given
    globalThis.alert = jest.fn()
    console.error = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      const op = url.split('/')[2]
      const data = (op === 'room')
        ? { next: fakeCursor, previous: null, results: [fakeRoom] }
        : fakeLend
      return Promise.resolve({ data })
    })
    renderWithProviders(<ChattingPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeLender
        }
      }
    })
    const roomButton = await screen.findByTestId('spyRoomButton0')
    await act(() => {
      fireEvent.click(roomButton)
    })

    // when
    mockServer.close({ code: 1011, reason: 'mock', wasClean: true })
    const sendButton = await screen.findByText('Send chat')
    await act(async () => {
      fireEvent.click(sendButton)
    })
    await act(async () => {
      const loadButton = await screen.findByText('loadMessage')
      fireEvent.click(loadButton)
    })

    // then
    await waitFor(() => expect(console.error).toHaveBeenCalledWith('Chat socket closed unexpectedly'))
    await waitFor(() => expect(globalThis.alert).toHaveBeenLastCalledWith('connection is closed'))
  })
  it('should close connections if user is connected to new room', async () => {
    // given
    console.error = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      const op = url.split('/')[2]
      const data = (op === 'room')
        ? { next: fakeCursor, previous: null, results: [fakeRoom, fakeRoomThirdParty] }
        : fakeLend
      return Promise.resolve({ data })
    })
    renderWithProviders(<ChattingPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeLender
        }
      }
    })
    const roomButton = await screen.findByTestId('spyRoomButton0')
    await act(() => {
      fireEvent.click(roomButton)
    })

    // when
    const roomThirdPartyButton = await screen.findByTestId('spyRoomButton1')
    await act(() => {
      fireEvent.click(roomThirdPartyButton)
    })

    // then
    await waitFor(() => expect(console.error).not.toHaveBeenCalled())
  })
  it('should handle comfirm lending error', async () => {
    // given
    console.error = jest.fn()
    globalThis.alert = jest.fn()
    globalThis.confirm = jest.fn().mockReturnValue(true)
    jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      const op = url.split('/')[2]
      const data = (op === 'room')
        ? { next: fakeCursor, previous: null, results: [fakeRoom] }
        : fakeLend
      return Promise.resolve({ data })
    })
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.reject(new Error('mock')))
    renderWithProviders(<ChattingPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeLender
        }
      }
    })

    // when
    const roomButton = await screen.findByTestId('spyRoomButton0')
    await act(() => {
      fireEvent.click(roomButton)
    })
    const confirmLendingButton = await screen.findByText('Confirm lending')
    await act(() => {
      fireEvent.click(confirmLendingButton)
    })

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Error on create borrow'))
  })
  it('should handle confirm return errors', async () => {
    // given
    globalThis.alert = jest.fn()
    globalThis.confirm = jest.fn().mockReturnValue(true)
    jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      const op = url.split('/')[2]
      const data = (op === 'room')
        ? { next: fakeCursor, previous: null, results: [fakeRoom] }
        : fakeLend
      return Promise.resolve({ data })
    })
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve({
      data: fakeBorrow
    }))
    renderWithProviders(<ChattingPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeLender
        }
      }
    })
    const roomButton = await screen.findByTestId('spyRoomButton0')
    await act(() => {
      fireEvent.click(roomButton)
    })
    const confirmLendingButton = await screen.findByText('Confirm lending')
    await act(() => {
      fireEvent.click(confirmLendingButton)
    })

    // when
    const confirmReturnButton = await screen.findByText('Confirm return')
    await act(() => {
      fireEvent.click(confirmReturnButton)
    })

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Unable to load lending status'))
  })
  it('should handle toggle borrow status error', async () => {
    // given
    globalThis.alert = jest.fn()
    globalThis.confirm = jest.fn().mockReturnValue(true)
    jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      const op = url.split('/')[2]
      const data = (op === 'room')
        ? { next: fakeCursor, previous: null, results: [fakeRoom] }
        : {
            ...fakeLend,
            status: fakeBorrow
          }
      return Promise.resolve({ data })
    })
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve({
      data: fakeBorrow
    }))
    jest.spyOn(axios, 'put').mockImplementation(() => Promise.reject(new Error('mock')))
    renderWithProviders(<ChattingPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeLender
        }
      }
    })

    // when
    const roomButton = await screen.findByTestId('spyRoomButton0')
    await act(() => {
      fireEvent.click(roomButton)
    })
    const confirmReturnButton = await screen.findByText('Confirm return')
    await act(() => {
      fireEvent.click(confirmReturnButton)
    })

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Error on toggle borrow status'))
  })
  it('should handle fetch lend error when confirm return', async () => {
    // given
    let isLendFetched = false
    console.error = jest.fn()
    globalThis.alert = jest.fn()
    globalThis.confirm = jest.fn().mockReturnValue(true)
    jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      const op = url.split('/')[2]
      if (op === 'room') {
        return Promise.resolve({ data: { next: fakeCursor, previous: null, results: [fakeRoom] } })
      } else if (!isLendFetched) {
        isLendFetched = true
        return Promise.resolve({
          data: {
            ...fakeLend,
            status: fakeBorrow
          }
        })
      } else {
        return Promise.reject(new Error('mock'))
      }
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
    renderWithProviders(<ChattingPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeLender
        }
      }
    })

    // when
    const roomButton = await screen.findByTestId('spyRoomButton0')
    await act(() => {
      fireEvent.click(roomButton)
    })
    const confirmReturnButton = await screen.findByText('Confirm return')
    await act(() => {
      fireEvent.click(confirmReturnButton)
    })

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Error on fetch lending information'))
  })
  it('should enter the room immediately if selectedRoom is not null', async () => {
    // given
    jest.spyOn(axios, 'get').mockImplementation((url: string) => Promise.resolve({
      data: { next: fakeCursor, previous: null, results: [fakeRoom] }
    }))
    renderWithProviders(<ChattingPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeLender
        },
        room: {
          ...preloadedState.room,
          selectedRoom: fakeRoom
        }
      }
    })

    // then
    await screen.findByTestId('spyRoom')
  })
  it('should handle loadMessage', async () => {
    // given
    globalThis.alert = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation((url: string) => Promise.resolve({
      data: { next: fakeCursor, previous: null, results: [fakeRoom] }
    }))
    renderWithProviders(<ChattingPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeLender
        },
        room: {
          ...preloadedState.room,
          selectedRoom: fakeRoom
        }
      }
    })

    await act(async () => {
      const loadButton = await screen.findByText('loadMessage')
      fireEvent.click(loadButton)
    })

    const chatBox = await screen.findByTestId('spyChatBox')
    await waitFor(() => expect(chatBox.innerHTML).toEqual(fakeChat.content + ',' + fakeChat.content))
  })
  it('should do not lend if lender canceled the confirm', async () => {
    // given
    globalThis.confirm = jest.fn().mockReturnValue(false)
    jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      const op = url.split('/')[2]
      const data = (op === 'room')
        ? { next: fakeCursor, previous: null, results: [fakeRoom] }
        : fakeLend
      return Promise.resolve({ data })
    })
    renderWithProviders(<ChattingPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeLender
        }
      }
    })

    // when
    const roomButton = await screen.findByTestId('spyRoomButton0')
    await act(() => {
      fireEvent.click(roomButton)
    })
    const confirmLendingButton = await screen.findByText('Confirm lending')
    await act(() => {
      fireEvent.click(confirmLendingButton)
    })

    // then
    await waitFor(() => expect(globalThis.confirm).toHaveBeenCalledWith('Are you sure you want to confirm lending?'))
  })
  it('should do not return if lender canceled the confirm', async () => {
    // given
    globalThis.confirm = jest.fn().mockReturnValue(false)
    jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      const op = url.split('/')[2]
      const data = (op === 'room')
        ? { next: fakeCursor, previous: null, results: [fakeRoom] }
        : {
            ...fakeLend,
            status: fakeBorrow
          }
      return Promise.resolve({ data })
    })
    renderWithProviders(<ChattingPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeLender
        }
      }
    })

    // when
    const roomButton = await screen.findByTestId('spyRoomButton0')
    await act(() => {
      fireEvent.click(roomButton)
    })
    const confirmReturnButton = await screen.findByText('Confirm return')
    await act(() => {
      fireEvent.click(confirmReturnButton)
    })

    // then
    await waitFor(() => expect(globalThis.confirm).toHaveBeenCalledWith('Are you sure you want to confirm return?'))
  })
})
