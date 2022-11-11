import { fireEvent, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { act } from 'react-dom/test-utils'
import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import UserStatusPage from './UserStatusPage'

interface ToggleTagRequestType {
  tag: string | number
}

const fakeUser = {
  id: 1,
  username: 'test_username'
}

const fakeLend = {
  id: 2,
  book: 3,
  book_info: {
    title: 'STATUS_TEST_TITLE',
    author: 'STATUS_TEST_AUTHOR',
    tags: ['STATUS_TEST_TAG_1', 'STATUS_TEST_TAG_2'],
    brief: 'STATUS_TEST_BRIEF'
  },
  owner: fakeUser.id,
  owner_username: fakeUser.username,
  questions: ['STATUS_TEST_QUESTION'],
  cost: 3000,
  additional: 'STATUS_TEST_ADDITIONAL',
  status: null
}

const fakeBorrow = {
  id: 4,
  borrower: fakeUser.id,
  borrower_username: fakeUser.username,
  lend_id: 5,
  active: true,
  lend_start_time: '1970-01-01T00:00:00.000Z',
  lend_end_time: null
}

const fakeTag = 'STATUS_TEST_TAG'
const fakeUpdateTag = 'STATUS_TEST_TAG_UPDATED'

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  Navigate: (props: any) => {
    mockNavigate(props.to)
    return null
  },
  useNavigate: () => mockNavigate
}))

const spyNavBar = () => <p>NavBar</p>
const spyBookListEntity = () => <p>BookListEntity</p>

jest.mock('../../components/NavBar/NavBar', () => spyNavBar)
jest.mock('../../components/BookListEntity/BookListEntity', () => spyBookListEntity)

const preloadedState: RootState = rootInitialState

describe('<UserStatusPage />', () => {
  it('should handle a use case', async () => {
    // given
    jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      const parsedUrl = url.split('/')
      const op = parsedUrl[2]
      if (op === 'lend') {
        return Promise.resolve({ data: [fakeLend] })
      } else if (op === 'borrow') {
        return Promise.resolve({ data: [fakeBorrow] })
      } else { // op === user
        const op2 = parsedUrl[3]
        if (op2 === 'tag') {
          return Promise.resolve({ data: [fakeTag] })
        } else { // op2 === watch
          return Promise.resolve({ data: [fakeLend] })
        }
      }
    })
    jest.spyOn(axios, 'put').mockImplementation((url, data) => {
      const typedData = data as ToggleTagRequestType
      const tag = typedData.tag
      if (typeof tag === 'string') {
        return Promise.resolve({
          data: { tag: fakeUpdateTag, created: true }
        })
      } else {
        return Promise.resolve({
          data: { tag: fakeTag, created: false }
        })
      }
    })
    await act(() => {
      renderWithProviders(<UserStatusPage />, {
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
      const tagDeleteButton = await screen.findByText('X')
      fireEvent.click(tagDeleteButton)
    })
    await act(async () => {
      const tagInput = await screen.findByRole('textbox')
      fireEvent.change(tagInput, { target: { value: fakeUpdateTag } })
    })
    await act(async () => {
      const tagAddButton = await screen.findByText('add')
      fireEvent.click(tagAddButton)
    })

    // then
    const addedTag = await screen.findByText(fakeUpdateTag)
    await waitFor(() => expect(addedTag.innerHTML).toEqual(fakeUpdateTag))
  })
  it('should handle impossible case (currentUser is null)', async () => {
    // given
    renderWithProviders(<UserStatusPage />, { preloadedState })

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'))
  })
  it('should handle fetch tag error', async () => {
    // given
    console.error = jest.fn()
    globalThis.alert = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      const parsedUrl = url.split('/')
      const op = parsedUrl[2]
      if (op === 'lend') {
        return Promise.resolve({ data: [fakeLend] })
      } else if (op === 'borrow') {
        return Promise.resolve({ data: [fakeBorrow] })
      } else { // op === user
        const op2 = parsedUrl[3]
        if (op2 === 'tag') {
          return Promise.reject(new Error('mock'))
        } else { // op2 === watch
          return Promise.resolve({ data: [fakeLend] })
        }
      }
    })
    await act(() => {
      renderWithProviders(<UserStatusPage />, {
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
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Error on fetch tags'))
  })
  it('should handle error on delete tag', async () => {
    // given
    console.error = jest.fn()
    globalThis.alert = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      const parsedUrl = url.split('/')
      const op = parsedUrl[2]
      if (op === 'lend') {
        return Promise.resolve({ data: [fakeLend] })
      } else if (op === 'borrow') {
        return Promise.resolve({ data: [fakeBorrow] })
      } else { // op === user
        const op2 = parsedUrl[3]
        if (op2 === 'tag') {
          return Promise.resolve({ data: [fakeTag] })
        } else { // op2 === watch
          return Promise.resolve({ data: [fakeLend] })
        }
      }
    })
    jest.spyOn(axios, 'put').mockImplementation(() => Promise.reject(new Error('mock')))
    await act(() => {
      renderWithProviders(<UserStatusPage />, {
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
      const tagDeleteButton = await screen.findByText('X')
      fireEvent.click(tagDeleteButton)
    })

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Error on delete tag'))
  })
  it('should handle error on delete tag', async () => {
    // given
    console.error = jest.fn()
    globalThis.alert = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      const parsedUrl = url.split('/')
      const op = parsedUrl[2]
      if (op === 'lend') {
        return Promise.resolve({ data: [fakeLend] })
      } else if (op === 'borrow') {
        return Promise.resolve({ data: [fakeBorrow] })
      } else { // op === user
        const op2 = parsedUrl[3]
        if (op2 === 'tag') {
          return Promise.resolve({ data: [fakeTag] })
        } else { // op2 === watch
          return Promise.resolve({ data: [fakeLend] })
        }
      }
    })
    jest.spyOn(axios, 'put').mockImplementation(() => Promise.reject(new Error('mock')))
    await act(() => {
      renderWithProviders(<UserStatusPage />, {
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
      const tagInput = await screen.findByRole('textbox')
      fireEvent.change(tagInput, { target: { value: fakeUpdateTag } })
    })
    await act(async () => {
      const tagAddButton = await screen.findByText('add')
      fireEvent.click(tagAddButton)
    })

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Error on add tag'))
  })
})
