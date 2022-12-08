import { fireEvent, screen, waitFor } from '@testing-library/react'
import { ChatType } from '../../containers/ChattingPage/ChattingPage'
import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import ChattingRoom from './ChattingRoom'

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
  borrower_username: fakeBorrower.username,
  questions: ['ROOMLIST_TEST_QUESTION'],
  answers: ['ROOMLIST_TEST_ANSWER']
}

const fakeInfo: ChatType = {
  id: 5,
  author: 2,
  author_username: 'test-user',
  content: 'test-info',
  timestamp: 'test-timestamp',
  rank: 'info'
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

const mockLoadMessage = jest.fn()

const preloadedState: RootState = rootInitialState

describe('<ChattingRoom />', () => {
  it('should handle LoadMessage', async () => {
    // given
    const mockSendMessage = jest.fn()
    const oldChat = [fakeInfo]
    const newChat = [fakeChat]
    renderWithProviders(
      <ChattingRoom
        room={fakeRoom}
        chatCursor={fakeCursor}
        oldChatList={oldChat}
        newChatList={newChat}
        loadMessage={mockLoadMessage}
        sendMessage={mockSendMessage}
      />,
      {
        preloadedState: {
          ...preloadedState,
          user: {
            ...preloadedState.user,
            currentUser: fakeLender
          }
        }
      }
    )

    // when
    const button = screen.getAllByRole('button')[0]
    fireEvent.click(button)

    // then
    await waitFor(() => expect(mockLoadMessage).toBeCalled())
  })
  it('should handle sendMessage when click the send message button', async () => {
    // given
    const mockSendMessage = jest.fn().mockReturnValue(true)
    const oldChat = [fakeInfo]
    const newChat = [fakeChat]
    renderWithProviders(
      <ChattingRoom
        room={fakeRoom}
        chatCursor={fakeCursor}
        oldChatList={oldChat}
        newChatList={newChat}
        loadMessage={mockLoadMessage}
        sendMessage={mockSendMessage}
      />,
      {
        preloadedState: {
          ...preloadedState,
          user: {
            ...preloadedState.user,
            currentUser: fakeLender
          }
        }
      }
    )

    // when
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test-content' } })
    const button = screen.getAllByRole('button')[1]
    fireEvent.click(button)

    // then
    await waitFor(() => expect(mockSendMessage).toHaveBeenCalledWith('test-content', 'chat'))
    await waitFor(() => expect(input.textContent).toEqual(''))
  })
  it('should handle sendMessage when user press enter key', async () => {
    // given
    const mockSendMessage = jest.fn()
    const oldChat = [fakeInfo]
    const newChat = [fakeChat]
    renderWithProviders(
      <ChattingRoom
        room={fakeRoom}
        chatCursor={fakeCursor}
        oldChatList={oldChat}
        newChatList={newChat}
        loadMessage={mockLoadMessage}
        sendMessage={mockSendMessage}
      />,
      {
        preloadedState: {
          ...preloadedState,
          user: {
            ...preloadedState.user,
            currentUser: fakeBorrower
          }
        }
      }
    )

    // when
    const input = screen.getByRole('textbox')
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })
    fireEvent.change(input, { target: { value: 'test-content2' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

    // then
    await waitFor(() => expect(mockSendMessage).toHaveBeenCalledWith('test-content2', 'chat'))
  })
})
