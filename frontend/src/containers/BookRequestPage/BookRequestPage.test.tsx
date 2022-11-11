import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import BookRequestPage from './BookRequestPage'

const fakeUser = {
  id: 1,
  username: 'test_username'
}

const fakeLender = {
  id: 2,
  username: 'test_lender_username'
}

const fakeLend = {
  id: 3,
  book: 4,
  book_info: {
    title: 'REQUEST_TEST_TITLE',
    author: 'REQUEST_TEST_AUTHOR',
    tags: ['REQUEST_TEST_TAG_1', 'REQUEST_TEST_TAG_2'],
    brief: 'REQUEST_TEST_BRIEF'
  },
  owner: fakeLender.id,
  owner_username: fakeLender.username,
  questions: ['REQUEST_TEST_QUESTION'],
  cost: 3000,
  additional: 'REQUEST_TEST_ADDITIONAL',
  status: null
}

const fakeRoom = {
  id: 5,
  lend_id: fakeLend.id,
  lender: fakeLender.id,
  lender_username: fakeLender.username,
  borrower: fakeUser.id,
  borrower_username: fakeUser.username
}

const fakeAnswer = 'REQUEST_TEST_ANSWER'

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  Navigate: (props: any) => {
    mockNavigate(props.to)
    return null
  },
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '3' })
}))

const spyNavBar = () => <p>NavBar</p>
jest.mock('../../components/NavBar/NavBar', () => spyNavBar)

const preloadedState: RootState = rootInitialState

describe('<BookRequestPage />', () => {
  it('should handle a use case', async () => {
    // given
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({
      data: fakeLend
    }))
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve({
      data: fakeRoom
    }))
    await act(() => {
      renderWithProviders(<BookRequestPage />, {
        preloadedState: {
          ...preloadedState,
          user: {
            ...preloadedState.user,
            currentUser: fakeUser
          }
        }
      })
    })

    // when
    await act(async () => {
      const answerInput = await screen.findByRole('textbox')
      fireEvent.change(answerInput, { target: { value: fakeAnswer } })
    })
    await act(async () => {
      const sendButton = await screen.findByText('Send to lender')
      fireEvent.click(sendButton)
    })

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/chat'))
  })
  it('should handle impossible case (currentUser is null)', async () => {
    // given
    renderWithProviders(<BookRequestPage />, { preloadedState })

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'))
  })
  it('should handle fetch lend error', async () => {
    // given
    globalThis.alert = jest.fn()
    console.error = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject(new Error('mock')))
    await act(() => {
      renderWithProviders(<BookRequestPage />, {
        preloadedState: {
          ...preloadedState,
          user: {
            ...preloadedState.user,
            currentUser: fakeUser
          }
        }
      })
    })

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Error on fetch lend'))
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/book/3'))
  })
  it('should not be able to request one\'s own book', async () => {
    // given
    globalThis.alert = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({
      data: {
        ...fakeLend,
        owner: fakeUser.id
      }
    }))
    await act(() => {
      renderWithProviders(<BookRequestPage />, {
        preloadedState: {
          ...preloadedState,
          user: {
            ...preloadedState.user,
            currentUser: fakeUser
          }
        }
      })
    })

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('You can\'t borrow your book!'))
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/main'))
  })
  it('should handle selectedLend null case', async () => {
    // given
    globalThis.alert = jest.fn()
    console.error = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject(new Error('mock')))
    await act(() => {
      renderWithProviders(<BookRequestPage />, {
        preloadedState: {
          ...preloadedState,
          user: {
            ...preloadedState.user,
            currentUser: fakeUser
          }
        }
      })
    })

    // when
    await act(async () => {
      const sendButton = await screen.findByText('Send to lender')
      fireEvent.click(sendButton)
    })

    // then
    await waitFor(() => expect(globalThis.alert).not.toHaveBeenCalledWith('You should fill in all answers.'))
  })
  it('should fill in all answers', async () => {
    // given
    globalThis.alert = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({
      data: fakeLend
    }))
    await act(() => {
      renderWithProviders(<BookRequestPage />, {
        preloadedState: {
          ...preloadedState,
          user: {
            ...preloadedState.user,
            currentUser: fakeUser
          }
        }
      })
    })

    // when
    await act(async () => {
      const sendButton = await screen.findByText('Send to lender')
      fireEvent.click(sendButton)
    })

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('You should fill in all answers.'))
  })
  it('should not be able to request same book twice', async () => {
    // given
    globalThis.alert = jest.fn()
    console.error = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({
      data: fakeLend
    }))
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.reject(new Error('mock')))
    await act(() => {
      renderWithProviders(<BookRequestPage />, {
        preloadedState: {
          ...preloadedState,
          user: {
            ...preloadedState.user,
            currentUser: fakeUser
          }
        }
      })
    })

    // when
    await act(async () => {
      const answerInput = await screen.findByRole('textbox')
      fireEvent.change(answerInput, { target: { value: fakeAnswer } })
    })
    await act(async () => {
      const sendButton = await screen.findByText('Send to lender')
      fireEvent.click(sendButton)
    })

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('You cannot request same book twice.'))
  })
})
