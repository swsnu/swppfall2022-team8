import { fireEvent, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { RootState } from '../../store'
import { UserType } from '../../store/slices/user/user'
import { BookType } from '../../store/slices/book/book'
import { LendType } from '../../store/slices/lend/lend'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import BookRegisterPage from './BookRegisterPage'

const fakeUser: UserType = {
  id: 1,
  username: 'test_username'
}

const fakeBook: BookType = {
  id: 2,
  image: '',
  title: 'TEST_TITLE',
  author: 'TEST_AUTHOR',
  tags: ['TEST_TAG'],
  brief: 'TEST_BRIEF'
}

const fakeLend: LendType = {
  id: 3,
  book: fakeBook.id,
  book_info: { ...fakeBook },
  owner: fakeUser.id,
  owner_username: fakeUser.username,
  images: [
    {
      id: 1,
      image: ''
    }
  ],
  questions: ['TEST_QUESTION'],
  cost: 3000,
  additional: 'TEST_ADDITIONAL',
  status: null
}

const fakeFile = new File(['test'], 'test_image.png', { type: 'image/png' })
global.URL.createObjectURL = jest.fn()

const spyNavBar = () => <p>NavBar</p>

jest.mock('../../components/NavBar/NavBar', () => spyNavBar)

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  Navigate: (props: any) => {
    mockNavigate(props.to)
    return null
  },
  useNavigate: () => mockNavigate
}))

const preloadedState: RootState = rootInitialState

describe('<BookRegisterPage />', () => {
  it('should handle single registration', async () => {
    // given
    jest.spyOn(axios, 'post').mockImplementation((url: string) => {
      const op = url.split('/')[2]
      const data = (op === 'book')
        ? fakeBook
        : fakeLend
      return Promise.resolve({ data })
    })
    const { container } = renderWithProviders(<BookRegisterPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeUser
        }
      }
    })
    const tabButton = await screen.findByText('Search Book')
    fireEvent.click(tabButton)

    const inputs = container.getElementsByTagName('input')
    const textareas = container.getElementsByTagName('textarea')
    const addButtons = await screen.findAllByText('add')
    const registerButton = await screen.findByText('Register')

    // when
    fireEvent.change(inputs[0], { target: { files: [fakeFile] } })
    fireEvent.change(inputs[1], { target: { value: fakeBook.title } })
    fireEvent.change(inputs[2], { target: { value: fakeBook.author } })
    fireEvent.change(inputs[3], { target: { value: fakeBook.brief } })
    fireEvent.change(inputs[4], { target: { value: fakeBook.tags[0] } })
    fireEvent.click(addButtons[0])
    fireEvent.change(inputs[5], { target: { files: [fakeFile] } })
    fireEvent.change(inputs[6], { target: { value: fakeLend.cost } })
    fireEvent.change(textareas[0], { target: { value: fakeLend.additional } })
    fireEvent.change(inputs[7], { target: { value: fakeLend.questions[0] } })
    fireEvent.click(addButtons[1])

    const deleteButtons = await screen.findAllByText('X')
    fireEvent.click(deleteButtons[0])
    fireEvent.click(deleteButtons[1])

    fireEvent.change(inputs[4], { target: { value: fakeBook.tags[0] } })
    fireEvent.click(addButtons[0])
    fireEvent.change(inputs[7], { target: { value: fakeLend.questions[0] } })
    fireEvent.click(addButtons[1])
    fireEvent.click(registerButton)

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/book/3'))
  })
  it('should fill in all the title, author, brief, and tag', async () => {
    // given
    const alertMessage = ['Should fill in :', 'book cover image', 'author', 'brief summary', 'at least one tag', 'at least one lend image']
    globalThis.alert = jest.fn()
    const { container } = renderWithProviders(<BookRegisterPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeUser
        }
      }
    })
    const tabButton = await screen.findByText('Search Book')
    fireEvent.click(tabButton)

    const inputs = container.getElementsByTagName('input')
    const registerButton = await screen.findByText('Register')

    // when
    fireEvent.change(inputs[1], { target: { value: fakeBook.title } })
    fireEvent.click(registerButton)

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith(alertMessage.join('\n')))
  })
  it('should handle impossible case (logout state)', async () => {
    // given
    renderWithProviders(<BookRegisterPage />, { preloadedState })
    const registerButton = await screen.findByText('Register')

    // when
    fireEvent.click(registerButton)

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'))
  })
  it('should handle failure of POST book', async () => {
    // given
    console.error = jest.fn()
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.reject(new Error('mock')))
    globalThis.alert = jest.fn()
    const { container } = renderWithProviders(<BookRegisterPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeUser
        }
      }
    })
    const tabButton = await screen.findByText('Search Book')
    fireEvent.click(tabButton)

    const inputs = container.getElementsByTagName('input')
    const textareas = container.getElementsByTagName('textarea')
    const addButtons = await screen.findAllByText('add')
    const registerButton = await screen.findByText('Register')

    // when
    fireEvent.change(inputs[0], { target: { files: [fakeFile] } })
    fireEvent.change(inputs[1], { target: { value: fakeBook.title } })
    fireEvent.change(inputs[2], { target: { value: fakeBook.author } })
    fireEvent.change(inputs[3], { target: { value: fakeBook.brief } })
    fireEvent.change(inputs[4], { target: { value: fakeBook.tags[0] } })
    fireEvent.click(addButtons[0])
    fireEvent.change(inputs[5], { target: { files: [fakeFile] } })
    fireEvent.change(inputs[6], { target: { value: fakeLend.cost } })
    fireEvent.change(textareas[0], { target: { value: fakeLend.additional } })
    fireEvent.change(inputs[7], { target: { value: fakeLend.questions[0] } })
    fireEvent.click(addButtons[1])
    fireEvent.click(registerButton)

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Error on Register a book (book)'))
  })
  it('should handle failure of POST lend', async () => {
    // given
    console.error = jest.fn()
    jest.spyOn(axios, 'post').mockImplementation((url: string) => {
      const op = url.split('/')[2]
      if (op === 'book') {
        return Promise.resolve({ data: fakeBook })
      } else {
        return Promise.reject(new Error('mock'))
      }
    })
    globalThis.alert = jest.fn()
    const { container } = renderWithProviders(<BookRegisterPage />, {
      preloadedState: {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          currentUser: fakeUser
        }
      }
    })
    const tabButton = await screen.findByText('Search Book')
    fireEvent.click(tabButton)

    const inputs = container.getElementsByTagName('input')
    const textareas = container.getElementsByTagName('textarea')
    const addButtons = await screen.findAllByText('add')
    const registerButton = await screen.findByText('Register')

    // when
    fireEvent.change(inputs[0], { target: { files: [fakeFile] } })
    fireEvent.change(inputs[1], { target: { value: fakeBook.title } })
    fireEvent.change(inputs[2], { target: { value: fakeBook.author } })
    fireEvent.change(inputs[3], { target: { value: fakeBook.brief } })
    fireEvent.change(inputs[4], { target: { value: fakeBook.tags[0] } })
    fireEvent.click(addButtons[0])
    fireEvent.change(inputs[5], { target: { files: [fakeFile] } })
    fireEvent.change(inputs[6], { target: { value: fakeLend.cost } })
    fireEvent.change(textareas[0], { target: { value: fakeLend.additional } })
    fireEvent.change(inputs[7], { target: { value: fakeLend.questions[0] } })
    fireEvent.click(addButtons[1])
    fireEvent.click(registerButton)

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Error on Register a book (lend)'))
  })
})
