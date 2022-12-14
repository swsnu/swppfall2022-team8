import { fireEvent, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { act } from 'react-dom/test-utils'
import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import BookEditPage from './BookEditPage'

const fakeUser = {
  id: 1,
  username: 'test_username'
}

const fakeLend = {
  id: 2,
  book: 3,
  book_info: {
    image: '',
    title: 'EDIT_TEST_TITLE',
    author: 'EDIT_TEST_AUTHOR',
    tags: ['EDIT_TEST_TAG_1', 'EDIT_TEST_TAG_2'],
    brief: 'EDIT_TEST_BRIEF'
  },
  owner: fakeUser.id,
  owner_username: fakeUser.username,
  images: [
    {
      id: 1,
      image: ''
    }
  ],
  questions: ['EDIT_TEST_QUESTION'],
  cost: 3000,
  additional: 'EDIT_TEST_ADDITIONAL',
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
  useParams: () => ({ id: '4' })
}))

const spyNavBar = () => <p>NavBar</p>
jest.mock('../../components/NavBar/NavBar', () => spyNavBar)

const preloadedState: RootState = rootInitialState

describe('<BookEditPage />', () => {
  it('should handle a edit story', async () => {
    // given
    const updatedLend = {
      ...fakeLend,
      questions: ['EDIT_TEST_QUESTION_UPDATED'],
      cost: 2000,
      additional: 'EDIT_TEST_ADDITIONAL_UPDATED'
    }
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({
      data: fakeLend
    }))
    jest.spyOn(axios, 'put').mockImplementation(() => Promise.resolve({
      data: updatedLend
    }))

    await act(() => {
      renderWithProviders(<BookEditPage />, {
        preloadedState: {
          ...preloadedState,
          user: {
            ...preloadedState.user,
            currentUser: fakeUser
          },
          lend: {
            ...preloadedState.lend,
            selectedLend: fakeLend
          }
        }
      })
    })

    // when
    const ranges = await screen.findAllByRole('slider')
    const textboxes = await screen.findAllByRole('textbox')

    const cost = ranges[0]
    const info = textboxes[0]
    const question = textboxes[1]

    await act(() => {
      fireEvent.change(cost, { target: { value: updatedLend.cost } })
    })
    await act(() => {
      fireEvent.change(info, { target: { value: updatedLend.additional } })
    })
    const deleteButton = await screen.findByText('X')
    await act(() => {
      fireEvent.click(deleteButton)
    })
    await act(() => {
      fireEvent.change(question, { target: { value: updatedLend.questions[0] } })
    })

    const addButton = await screen.findByText('add')
    await act(() => {
      fireEvent.click(addButton)
    })

    await act(async () => {
      const editButton = await screen.findByText('Edit')
      fireEvent.click(editButton)
    })

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(`/book/${updatedLend.id}`))
  })
  it('should handle impossible case (current user is null)', async () => {
    // given
    await act(() => {
      renderWithProviders(<BookEditPage />, { preloadedState })
    })

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'))
  })
  it('should handle impossible case (edit someone else\'s book)', async () => {
    // given
    globalThis.alert = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({
      data: {
        ...fakeLend,
        owner: 987
      }
    }))
    await act(() => {
      renderWithProviders(<BookEditPage />, {
        preloadedState: {
          ...preloadedState,
          user: {
            ...preloadedState.user,
            currentUser: fakeUser
          },
          lend: {
            ...preloadedState.lend,
            selectedLend: fakeLend
          }
        }
      })
    })

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('You can\'t edit other\'s book!'))
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/main'))
  })
  it('should handle fetch lend error', async () => {
    // given
    console.error = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject(new Error('mock')))
    await act(() => {
      renderWithProviders(<BookEditPage />, {
        preloadedState: {
          ...preloadedState,
          user: {
            ...preloadedState.user,
            currentUser: fakeUser
          },
          lend: {
            ...preloadedState.lend,
            selectedLend: fakeLend
          }
        }
      })
    })

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/book/4'))
  })
})
