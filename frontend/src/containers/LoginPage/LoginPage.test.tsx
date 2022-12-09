import { fireEvent, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { RootState } from '../../store'
import { errorPrefix } from '../../store/slices/user/user'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import LoginPage from './LoginPage'

const fakeUser = {
  id: 1,
  username: 'test_username'
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

describe('<LoginPage />', () => {
  it('should handle login', async () => {
    // given
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve({
      data: {
        ...fakeUser,
        token: 'token_test'
      }
    }))
    const { store } = renderWithProviders(<LoginPage />, { preloadedState })
    const username = screen.getByLabelText('Username')
    const password = screen.getByLabelText('Password')
    const loginButton = screen.getByText('Login')

    // when
    fireEvent.change(username, { target: { value: 'test_username' } })
    await screen.findByDisplayValue('test_username')
    fireEvent.change(password, { target: { value: 'test_password' } })
    await screen.findByDisplayValue('test_password')
    fireEvent.click(loginButton)

    // then
    await waitFor(() => expect(store.getState().user.currentUser).toEqual(fakeUser))
  })
  it('should handle signup button', async () => {
    // given
    renderWithProviders(<LoginPage />, { preloadedState })
    const signupButton = screen.getByText('Sign up')

    // when
    fireEvent.click(signupButton)

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/signup'))
  })
  it('should handle 403 error', async () => {
    // given
    console.error = jest.fn()
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.reject(new Error(errorPrefix(403))))
    renderWithProviders(<LoginPage />, { preloadedState })
    const username = screen.getByLabelText('Username')
    const password = screen.getByLabelText('Password')
    const loginButton = screen.getByText('Login')

    // when
    fireEvent.change(username, { target: { value: 'test_username' } })
    await screen.findByDisplayValue('test_username')
    fireEvent.change(password, { target: { value: 'test_password' } })
    await screen.findByDisplayValue('test_password')
    fireEvent.click(loginButton)

    // then
    const modalHeader = await screen.findByText('Username or Password is wrong')

    // when
    const closeButton = await screen.findByText('Close')
    fireEvent.click(closeButton)

    // then
    await waitFor(() => expect(modalHeader).not.toBeInTheDocument())
  })
  it('should handle unexpected error', async () => {
    // given
    console.error = jest.fn()
    globalThis.alert = jest.fn()
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.reject(new Error(errorPrefix(400))))
    renderWithProviders(<LoginPage />, { preloadedState })
    const username = screen.getByLabelText('Username')
    const password = screen.getByLabelText('Password')
    const loginButton = screen.getByText('Login')

    // when
    fireEvent.change(username, { target: { value: 'test_username' } })
    await screen.findByDisplayValue('test_username')
    fireEvent.change(password, { target: { value: 'test_password' } })
    await screen.findByDisplayValue('test_password')
    fireEvent.click(loginButton)

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Error on login'))
  })
  it('should react to the Enter key at username input box', async () => {
    // given
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve({
      data: {
        ...fakeUser,
        token: 'token_test'
      }
    }))
    const { store } = renderWithProviders(<LoginPage />, { preloadedState })
    const username = screen.getByLabelText('Username')
    const password = screen.getByLabelText('Password')

    // when
    fireEvent.keyPress(username, { key: 'Enter', code: 13, charCode: 13 })
    fireEvent.change(username, { target: { value: 'test_username' } })
    await screen.findByDisplayValue('test_username')
    fireEvent.change(password, { target: { value: 'test_password' } })
    fireEvent.keyPress(username, { key: 'Enter', code: 13, charCode: 13 })

    // then
    await waitFor(() => expect(store.getState().user.currentUser).toEqual(fakeUser))
  })
  it('should react to the Enter key at password input box', async () => {
    // given
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve({
      data: {
        ...fakeUser,
        token: 'token_test'
      }
    }))
    const { store } = renderWithProviders(<LoginPage />, { preloadedState })
    const username = screen.getByLabelText('Username')
    const password = screen.getByLabelText('Password')

    // when
    fireEvent.keyPress(password, { key: 'Enter', code: 13, charCode: 13 })
    fireEvent.change(username, { target: { value: 'test_username' } })
    await screen.findByDisplayValue('test_username')
    fireEvent.change(password, { target: { value: 'test_password' } })
    fireEvent.keyPress(password, { key: 'Enter', code: 13, charCode: 13 })

    // then
    await waitFor(() => expect(store.getState().user.currentUser).toEqual(fakeUser))
  })
})
