import { fireEvent, screen, waitFor } from '@testing-library/react'
import { RootState } from '../../store'
import { renderWithProviders } from '../../test-utils/mock'
import ChattingRoomList from './ChattingRoomList'

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

const mockClickRoomHandler = jest.fn()

describe('<ChattingRoomList />', () => {
  it('should handle click Button', async () => {
    // given
    renderWithProviders(
      <ChattingRoomList
        group='lend'
        clickRoomHandler={mockClickRoomHandler}
      />,
      { preloadedState }
    )
    const button = screen.getByRole('button')

    // when
    fireEvent.click(button)

    // then
    await waitFor(() => expect(mockClickRoomHandler).toHaveBeenCalled())
  })
})
