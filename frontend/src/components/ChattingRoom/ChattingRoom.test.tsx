import { fireEvent, screen, waitFor } from '@testing-library/react'
import { ChatType } from '../../containers/ChattingPage/ChattingPage'
import { RootState } from '../../store'
import { renderWithProviders } from '../../test-utils/mock'
import ChattingRoom from './ChattingRoom'

const preloadedState: RootState = {
  book: {
    books: [
      {
        id: 1,
        image: '',
        title: 'test-title',
        author: 'test-author',
        tags: ['test-string'],
        brief: 'test-brief'
      }
    ],
    selectedBook: null
  },
  lend: {
    lends: [
      {
        id: 2,
        book: 1,
        book_info: {
          image: '',
          title: 'test-title',
          author: 'test-author',
          tags: ['test-string'],
          brief: 'test-brief'
        },
        owner: 3,
        owner_username: 'test-lender',
        questions: ['test-question'],
        cost: 0,
        additional: 'test-additional',
        status: null
      }
    ],
    userLends: [
      {
        id: 1,
        book: 1,
        book_info: {
          image: '',
          title: 'test-title',
          author: 'test-author',
          tags: ['test-string'],
          brief: 'test-brief'
        },
        owner: 1,
        owner_username: 'test-user',
        questions: ['test-question'],
        cost: 0,
        additional: 'test-additional',
        status: null
      }
    ],
    selectedLend: null
  },
  borrow: {
    userBorrows: [],
    selectedBorrow: null
  },
  user: {
    currentUser: {
      id: 1,
      username: 'test-user'
    },
    subscribed_tags: [],
    watch_list: [],
    recommend: {
      is_queued: false,
      is_outdated: false,
      enqueued: false,
      recommend_list: []
    }
  },
  room: {
    rooms_lend: [
      {
        id: 1,
        lend_id: 1,
        lender: 1,
        lender_username: 'test-user',
        borrower: 2,
        borrower_username: 'test-borrower'
      }
    ],
    rooms_borrow: [
      {
        id: 2,
        lend_id: 2,
        lender: 3,
        lender_username: 'test-lender',
        borrower: 1,
        borrower_username: 'test-user'
      }
    ]
  }
}
const fakeChatList: ChatType[] = [
  {
    id: 1,
    author: 1,
    author_username: 'test-user',
    content: 'test-content',
    timestamp: 'test-timestamp'
  },
  {
    id: 2,
    author: 2,
    author_username: 'test-counterpart',
    content: 'test-content',
    timestamp: 'test-timestamp'
  }
]
const mockChangeChatInput = jest.fn()
const mockClickSendChatHandler = jest.fn()

describe('<ChattingRoom />', () => {
  it('should handler click button', async () => {
    // given
    renderWithProviders(
      <ChattingRoom
        group='lend'
        chatIdx={0}
        chatList={fakeChatList}
        chatInput={''}
        changeChatInput={mockChangeChatInput}
        clickSendChatHandler={mockClickSendChatHandler}
      />,
      { preloadedState }
    )
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button')

    // when
    fireEvent.change(input, { target: { value: 'test-input' } })
    fireEvent.click(button)

    // then
    await waitFor(() => expect(mockChangeChatInput).toHaveBeenCalled())
    await waitFor(() => expect(mockClickSendChatHandler).toHaveBeenCalled())
  })
  it('should handle press Enter', async () => {
    // given
    renderWithProviders(
      <ChattingRoom
        group='borrow'
        chatIdx={0}
        chatList={fakeChatList}
        chatInput={''}
        changeChatInput={mockChangeChatInput}
        clickSendChatHandler={mockClickSendChatHandler}
      />,
      { preloadedState }
    )
    const input = screen.getByRole('textbox')

    // when
    fireEvent.change(input, { target: { value: 'test-input' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    // then
    await waitFor(() => expect(mockClickSendChatHandler).toHaveBeenCalled())
  })
  it('should not handle press Key other than Enter', async () => {
    // given
    renderWithProviders(
      <ChattingRoom
        group='borrow'
        chatIdx={0}
        chatList={fakeChatList}
        chatInput={''}
        changeChatInput={mockChangeChatInput}
        clickSendChatHandler={mockClickSendChatHandler}
      />,
      { preloadedState }
    )
    const input = screen.getByRole('textbox')

    // when
    fireEvent.change(input, { target: { value: 'test-input' } })
    fireEvent.keyDown(input, { key: 'Space' })

    // then
    await waitFor(() => expect(mockClickSendChatHandler).not.toHaveBeenCalled())
  })
})
