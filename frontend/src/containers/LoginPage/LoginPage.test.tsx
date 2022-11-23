import { fireEvent, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { RootState } from '../../store'
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
    fireEvent.keyDown(username, { key: 'Ctrl' })
    fireEvent.keyDown(username, { key: 'Enter' })
    fireEvent.change(username, { target: { value: 'test_username' } })
    await screen.findByDisplayValue('test_username')
    fireEvent.keyDown(password, { key: 'Ctrl' })
    fireEvent.keyDown(password, { key: 'Enter' })
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
})
