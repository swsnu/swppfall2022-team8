import { fireEvent, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { act } from 'react-dom/test-utils'
import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import BookDetailPage from './BookDetailPage'

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
    tags: [...Array(20)].map((_val, idx) => `REQUEST_TEST_TAG_${idx + 1}`),
    brief: 'REQUEST_TEST_BRIEF'
  },
  owner: fakeLender.id,
  owner_username: fakeLender.username,
  questions: ['REQUEST_TEST_QUESTION'],
  cost: 3000,
  additional: 'REQUEST_TEST_ADDITIONAL',
  status: null
}

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

describe('<BookDetailPage />', () => {
  it('should handle lender use case (edit button)', async () => {
    // given
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({
      data: fakeLend
    }))
    renderWithProviders(<BookDetailPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeLender
        }
      }
    })

    // when
    const infoButton = await screen.findByText('Additional Info')
    fireEvent.click(infoButton)
    const editButton = await screen.findByText('Edit')
    fireEvent.click(editButton)

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/book/3/edit'))
  })
  it('should handle lender use case (delete button)', async () => {
    // given
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({
      data: fakeLend
    }))
    jest.spyOn(axios, 'delete').mockImplementation(() => Promise.resolve())
    renderWithProviders(<BookDetailPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeLender
        }
      }
    })

    // when
    const deleteButton = await screen.findByText('Delete')
    fireEvent.click(deleteButton)

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/main'))
  })
  it('should handle borrower user case (request button)', async () => {
    // given
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({
      data: fakeLend
    }))
    renderWithProviders(<BookDetailPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeUser
        }
      }
    })

    // when
    await act(async () => {
      const requestButton = await screen.findByText('Request')
      fireEvent.click(requestButton)
    })

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/book/3/request'))
  })
  it('should handle borrower user case (watch button)', async () => {
    // given
    let watched = false
    globalThis.alert = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({
      data: fakeLend
    }))
    jest.spyOn(axios, 'put').mockImplementation(() => {
      if (!watched) {
        watched = true
        return Promise.resolve({
          data: {
            created: true,
            lend_info: fakeLend
          }
        })
      } else {
        watched = false
        return Promise.resolve({
          data: {
            created: false,
            lend_info: fakeLend
          }
        })
      }
    })
    renderWithProviders(<BookDetailPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeUser
        }
      }
    })

    // when
    await act(async () => {
      const watchButton = await screen.findByText('Watch')
      fireEvent.click(watchButton)
    })
    await act(async () => {
      const watchButton = await screen.findByText('Watch')
      fireEvent.click(watchButton)
    })

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Watch Success!'))
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Watch Canceled!'))
  })
  it('should display borrow info if the book is borrowed', async () => {
    // given
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({
      data: {
        ...fakeLend,
        status: 'borrowed'
      }
    }))
    renderWithProviders(<BookDetailPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeUser
        }
      }
    })

    // then
    await screen.findByText('Borrowed')
  })
  it('should handle pseudo-pagination on tag', async () => {
    // given
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({
      data: fakeLend
    }))
    await act(() => {
      renderWithProviders(<BookDetailPage />, {
        preloadedState: {
          ...preloadedState,
          user: {
            ...preloadedState.user,
            currentUser: fakeLender
          }
        }
      })
    })

    // when
    await act(async () => {
      const nextPage = await screen.findByText('Next')
      fireEvent.click(nextPage)
    })

    // then
    await screen.findByText(fakeLend.book_info.tags.slice(10, 20).map(val => `#${val}`).join(' '))

    // when
    await act(async () => {
      const prevPage = await screen.findByText('Prev')
      fireEvent.click(prevPage)
    })

    // then
    await screen.findByText(fakeLend.book_info.tags.slice(0, 10).map(val => `#${val}`).join(' '))
  })
})
