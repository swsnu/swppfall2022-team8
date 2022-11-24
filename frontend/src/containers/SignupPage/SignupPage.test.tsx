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
    axios.post = jest.fn().mockResolvedValue({
      data: {
        ...fakeUser,
        token: 'token_test'
      }
    })
    axios.put = jest.fn().mockResolvedValue({
      data: {
        tag: 'fantasy'
      }
    })
    renderWithProviders(<SignupPage />, { preloadedState })
    const username = screen.getByPlaceholderText('username')
    const passwordInputs = screen.getAllByPlaceholderText('password')
    const password = passwordInputs[0]
    const confirmPassword = passwordInputs[1]
    const submit = screen.getByText('Submit')

    // when
    fireEvent.change(username, { target: { value: 'test_username' } })
    await screen.findByDisplayValue('test_username')
    fireEvent.change(password, { target: { value: 'test_password' } })
    await screen.findByDisplayValue('test_password')
    fireEvent.change(confirmPassword, { target: { value: 'test_password' } })
    const passwords = await screen.findAllByDisplayValue('test_password')
    expect(passwords.length).toBe(2)
    const fantasyTag = screen.getByText('fantasy')
    fireEvent.click(fantasyTag)
    fireEvent.click(submit)

    // then
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1))
  })
  it('should alert error if password is not equal to "confirm password"', async () => {
    // given
    globalThis.alert = jest.fn()
    renderWithProviders(<SignupPage />, { preloadedState })
    const username = screen.getByPlaceholderText('username')
    const passwordInputs = screen.getAllByPlaceholderText('password')
    const password = passwordInputs[0]
    const confirmPassword = passwordInputs[1]
    const submit = screen.getByText('Submit')

    // when
    fireEvent.change(username, { target: { value: 'test_username' } })
    await screen.findByDisplayValue('test_username')
    fireEvent.change(password, { target: { value: 'test_password' } })
    await screen.findByDisplayValue('test_password')
    fireEvent.change(confirmPassword, { target: { value: 'test_fail_confirm' } })
    await screen.findByDisplayValue('test_fail_confirm')
    const fantasyTag = screen.getByText('fantasy')
    fireEvent.click(fantasyTag)
    fireEvent.click(submit)

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Please check your password.'))
  })
  it('should alert error if none of tags is selected', async () => {
    // given
    globalThis.alert = jest.fn()
    renderWithProviders(<SignupPage />, { preloadedState })
    const username = screen.getByPlaceholderText('username')
    const passwordInputs = screen.getAllByPlaceholderText('password')
    const password = passwordInputs[0]
    const confirmPassword = passwordInputs[1]
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
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Please select at least one tag.'))
  })
  it('should alert error if something on signup is wrong', async () => {
    // given
    console.error = jest.fn()
    globalThis.alert = jest.fn()
    axios.post = jest.fn().mockRejectedValue({ data: 'mock' })
    renderWithProviders(<SignupPage />, { preloadedState })
    const username = screen.getByPlaceholderText('username')
    const passwordInputs = screen.getAllByPlaceholderText('password')
    const password = passwordInputs[0]
    const confirmPassword = passwordInputs[1]
    const submit = screen.getByText('Submit')

    // when
    fireEvent.change(username, { target: { value: 'test_username' } })
    await screen.findByDisplayValue('test_username')
    fireEvent.change(password, { target: { value: 'test_password' } })
    await screen.findByDisplayValue('test_password')
    fireEvent.change(confirmPassword, { target: { value: 'test_password' } })
    const passwords = await screen.findAllByDisplayValue('test_password')
    expect(passwords.length).toBe(2)
    const fantasyTag = screen.getByText('fantasy')
    fireEvent.click(fantasyTag)
    fireEvent.click(submit)

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Error on signup'))
  })
})
