import { screen, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'
import { act } from 'react-dom/test-utils'
import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import ChattingRightMenu from './ChattingRightMenu'

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
  questions: ['RIGHTMENU_TEST_QUESTION_1', 'RIGHTMENU_TEST_QUESTION_2'],
  answers: ['RIGHTMENU_TEST_ANSWER']
}

const fakeLend = {
  id: 4,
  book: 5,
  book_info: {
    title: 'RIGHTMENU_TEST_TITLE',
    author: 'RIGHTMENU_TEST_AUTHOR',
    tags: [...Array(20)].map((_val, idx) => `RIGHTMENU_TEST_TAG_${idx + 1}`),
    brief: 'RIGHTMENU_TEST_BRIEF'
  },
  owner: fakeLender.id,
  owner_username: fakeLender.username,
  questions: ['RIGHTMENU_TEST_QUESTION_1', 'RIGHTMENU_TEST_QUESTION_2'],
  cost: 3000,
  images: [
    {
      id: 1,
      image: ''
    }
  ],
  additional: 'RIGHTMENU_TEST_ADDITIONAL',
  status: null
}

const preloadedState: RootState = rootInitialState

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  Navigate: (props: any) => {
    mockNavigate(props.to)
    return null
  },
  useNavigate: () => mockNavigate
}))

const mockClickConfirmLendingHandler = jest.fn()
const mockClickConfirmReturnHandler = jest.fn()

describe('<ChattingRightMenu />', () => {
  it('should navigate when clicked (group=lend borrowable=true, borrowd=false)', async () => {
    // given
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ data: fakeLend }))
    await act(async () => {
      renderWithProviders(
        <ChattingRightMenu
          room={fakeRoom}
          borrowable={true}
          borrowed={false}
          clickConfirmLendingHandler={mockClickConfirmLendingHandler}
          clickConfirmReturnHandler={mockClickConfirmReturnHandler}
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
    })

    const button = await screen.findByText('Confirm lending')

    // when
    fireEvent.click(button)

    // then
    await waitFor(() => expect(mockClickConfirmLendingHandler).toHaveBeenCalled())
  })
  it('should navigate when clicked (group=lend borrowable=false, borrowd=true)', async () => {
    // given
    renderWithProviders(
      <ChattingRightMenu
        room={fakeRoom}
        borrowable={false}
        borrowed={true}
        clickConfirmLendingHandler={mockClickConfirmLendingHandler}
        clickConfirmReturnHandler={mockClickConfirmReturnHandler}
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
    const button = await screen.findByText('Confirm return')

    // when
    fireEvent.click(button)

    // then
    await waitFor(() => expect(mockClickConfirmReturnHandler).toHaveBeenCalled())
  })
  it('should render (group=lend borrowable=false, borrowd=false)', async () => {
    // given
    const { container } = renderWithProviders(
      <ChattingRightMenu
        room={fakeRoom}
        borrowable={false}
        borrowed={false}
        clickConfirmLendingHandler={mockClickConfirmLendingHandler}
        clickConfirmReturnHandler={mockClickConfirmReturnHandler}
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
    const info = container.getElementsByTagName('h5')

    // then
    expect(info.item(0)?.innerHTML).toEqual('You\'ve already lent your book to someone!')
  })
  it('should render (group=borrow borrowable=true, borrowd=false)', async () => {
    // given
    const { container } = renderWithProviders(
      <ChattingRightMenu
        room={fakeRoom}
        borrowable={true}
        borrowed={false}
        clickConfirmLendingHandler={mockClickConfirmLendingHandler}
        clickConfirmReturnHandler={mockClickConfirmReturnHandler}
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
    const info = container.getElementsByTagName('h5')

    // then
    expect(info.item(0)?.innerHTML).toEqual('You can borrow this book!')
  })
  it('should render (group=borrow borrowable=false, borrowd=true)', async () => {
    // given
    const { container } = renderWithProviders(
      <ChattingRightMenu
        room={fakeRoom}
        borrowable={false}
        borrowed={true}
        clickConfirmLendingHandler={mockClickConfirmLendingHandler}
        clickConfirmReturnHandler={mockClickConfirmReturnHandler}
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
    const info = container.getElementsByTagName('h5')

    // then
    expect(info.item(0)?.innerHTML).toEqual('You are borrowing this book now!')
  })
  it('should render (group=borrow borrowable=false, borrowd=false)', async () => {
    // given
    const { container } = renderWithProviders(
      <ChattingRightMenu
        room={fakeRoom}
        borrowable={false}
        borrowed={false}
        clickConfirmLendingHandler={mockClickConfirmLendingHandler}
        clickConfirmReturnHandler={mockClickConfirmReturnHandler}
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
    const info = container.getElementsByTagName('h5')

    // then
    expect(info.item(0)?.innerHTML).toEqual('Someone has already borrowed this book...')
  })
  it('should not display answer when answers are empty', async () => {
    // given
    renderWithProviders(
      <ChattingRightMenu
        room={{
          ...fakeRoom,
          answers: []
        }}
        borrowable={true}
        borrowed={false}
        clickConfirmLendingHandler={mockClickConfirmLendingHandler}
        clickConfirmReturnHandler={mockClickConfirmReturnHandler}
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

    const qna = screen.getAllByRole('heading')[2]

    expect(qna.innerHTML).toEqual('<b>A1.</b>')
  })
})
