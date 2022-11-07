import { fireEvent, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import SignupPage from './SignupPage'

const fakeUser = {
  id: 1,
  username: 'test_username'
}

const preloadedState: RootState = rootInitialState

describe('<SignupPage />', () => {
  it('should handle signup', async () => {
    // given
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve({
      data: {
        ...fakeUser,
        token: 'token_test'
      }
    }))
    const { store } = renderWithProviders(<SignupPage />, { preloadedState })
    const username = screen.getByLabelText('Username')
    const password = screen.getByLabelText('Password')
    const confirmPassword = screen.getByLabelText('Confirm Password')
    const submit = screen.getByText('Submit')

    // when
    fireEvent.change(username, { target: { value: 'test_username' } })
    await screen.findByDisplayValue('test_username')
    fireEvent.change(password, { target: { value: 'test_password' } })
    await screen.findByDisplayValue('test_password')
    fireEvent.change(confirmPassword, { target: { value: 'test_password' } })
    const passwords = await screen.findAllByDisplayValue('test_password')
    expect(passwords.length).toBe(2)
    fireEvent.click(submit)

    // then
    await waitFor(() => expect(store.getState().user.currentUser).toEqual(fakeUser))
  })
  it('should alert error if password is not equal to "confirm password"', async () => {
    // given
    globalThis.alert = jest.fn()
    renderWithProviders(<SignupPage />, { preloadedState })
    const username = screen.getByLabelText('Username')
    const password = screen.getByLabelText('Password')
    const confirmPassword = screen.getByLabelText('Confirm Password')
    const submit = screen.getByText('Submit')

    // when
    fireEvent.change(username, { target: { value: 'test_username' } })
    await screen.findByDisplayValue('test_username')
    fireEvent.change(password, { target: { value: 'test_password' } })
    await screen.findByDisplayValue('test_password')
    fireEvent.change(confirmPassword, { target: { value: 'test_fail_confirm' } })
    await screen.findByDisplayValue('test_fail_confirm')
    fireEvent.click(submit)

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Please check your password.'))
  })
})
