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

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: () => ({ search: '?title=TITLE' })
}))

const preloadedState: RootState = rootInitialState

describe('<BookListPage />', () => {
  it('should render without error', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({
      data: [fakeLend]
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
  })
})
