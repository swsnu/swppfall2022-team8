import { fireEvent, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { act } from 'react-dom/test-utils'
import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import BookListPage from './BookListPage'

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
    title: 'LIST_TEST_TITLE',
    author: 'LIST_TEST_AUTHOR',
    tags: ['LIST_TEST_TAG_1', 'LIST_TEST_TAG_2'],
    brief: 'LIST_TEST_BRIEF'
  },
  owner: fakeLender.id,
  owner_username: fakeLender.username,
  questions: ['LIST_TEST_QUESTION'],
  cost: 3000,
  additional: 'LIST_TEST_ADDITIONAL',
  status: null
}

const spyNavBar = () => <p>NavBar</p>
const spySearchBar = () => <p>SearchBar</p>
const spyBookListEntity = () => <p>BookListEntity</p>

jest.mock('../../components/NavBar/NavBar', () => spyNavBar)
jest.mock('../../components/SearchBar/SearchBar', () => spySearchBar)
jest.mock('../../components/BookListEntity/BookListEntity', () => spyBookListEntity)

const mockNavigate = jest.fn()
let mockQueryString = '?title=TITLE'
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  Navigate: (props: any) => {
    mockNavigate(props.to)
    return null
  },
  useNavigate: () => mockNavigate,
  useLocation: () => ({ search: mockQueryString })
}))

const preloadedState: RootState = rootInitialState

describe('<BookListPage />', () => {
  it('should handle pagination', async () => {
    // given
    window.scrollTo = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [fakeLend]
      }
    }))
    await act(() => {
      renderWithProviders(<BookListPage />, {
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
    const page = screen.getByText('1')
    fireEvent.click(page)

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/search?title=TITLE&page=1'))
    await waitFor(() => expect(window.scrollTo).toHaveBeenCalledWith(0, 0))
  })
  it('should render proper page if page parameter is given', async () => {
    // given
    mockQueryString = '?title=TITLE&page=1'
    window.scrollTo = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [fakeLend]
      }
    }))
    await act(() => {
      renderWithProviders(<BookListPage />, {
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
    screen.getByText('1')
  })
})
