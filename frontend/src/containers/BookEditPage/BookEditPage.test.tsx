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
    title: 'EDIT_TEST_TITLE',
    author: 'EDIT_TEST_AUTHOR',
    tags: ['EDIT_TEST_TAG_1', 'EDIT_TEST_TAG_2'],
    brief: 'EDIT_TEST_BRIEF'
  },
  owner: fakeUser.id,
  owner_username: fakeUser.username,
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
  it('should handle one edit story', async () => {
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

    // when
    const ranges = await screen.findAllByRole('slider')
    const textboxes = await screen.findAllByRole('textbox')

    const cost = ranges[0]
    const info = textboxes[0]
    const question = textboxes[1]

    await act(() => {
      fireEvent.change(cost, { target: { value: updatedLend.cost } })
      fireEvent.change(info, { target: { value: updatedLend.additional } })
    })
    const deleteButton = await screen.findByText('X')
    await act(() => {
      fireEvent.click(deleteButton)
      fireEvent.change(question, { target: { value: updatedLend.questions[0] } })
    })
    const addButton = await screen.findByText('add')
    await act(() => {
      fireEvent.click(addButton)
    })

    const editButton = await screen.findByText('Edit')
    await act(() => {
      fireEvent.click(editButton)
    })

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(`/book/${updatedLend.id}`))
  })
})
