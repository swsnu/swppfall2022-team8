import { fireEvent, screen, waitFor } from '@testing-library/react'
import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import SearchBar from './SearchBar'

const preloadedState: RootState = rootInitialState

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate
}))
const mockAlert = jest.fn()
window.alert = mockAlert

describe('<SearchBar />', () => {
  it('should handle add Buttons', async () => {
    // given
    renderWithProviders(<SearchBar />, { preloadedState })
    const input = screen.getByPlaceholderText('search')
    const title = screen.getByText('Add title')
    const author = screen.getByText('Add author')
    const tag = screen.getByText('Add tag')
    const button = screen.getByText('Search')

    // when
    fireEvent.change(input, { target: { value: 'test-input' } })
    fireEvent.click(title)
    fireEvent.change(input, { target: { value: 'test-input' } })
    fireEvent.click(author)
    fireEvent.change(input, { target: { value: 'test-input' } })
    fireEvent.click(tag)
    fireEvent.click(button)

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled())
  })
  it('should handle alert when no search query', async () => {
    // given
    renderWithProviders(<SearchBar />, { preloadedState })
    const button = screen.getByText('Search')

    // when
    fireEvent.click(button)

    // then
    await waitFor(() => expect(mockAlert).toHaveBeenCalled())
  })
  it('should handle alert when try to add no content tag', async () => {
    // given
    renderWithProviders(<SearchBar />, { preloadedState })
    const input = screen.getByPlaceholderText('search')
    const tag = screen.getByText('Add tag')

    // when
    fireEvent.change(input, { target: { value: 'test-!@#$' } })
    fireEvent.click(tag)

    // then
    await waitFor(() => expect(mockAlert).toHaveBeenCalled())
  })
  it('should handle click Reset button', async () => {
    // given
    renderWithProviders(<SearchBar />, { preloadedState })
    const reset = screen.getByText('Reset')

    // when
    fireEvent.click(reset)

    // then
  })
  it('should handle delete Buttons', async () => {
    // given
    renderWithProviders(<SearchBar title='test-title' author='test-author' tag={['test-tag']} />, { preloadedState })
    const buttons = screen.getAllByText('x')

    // when
    buttons.map(
      button => fireEvent.click(button)
    )

    // then
  })
  it('should handle minor branches', async () => {
    // given
    renderWithProviders(<SearchBar />, { preloadedState })
    const input = screen.getByPlaceholderText('search')
    const tag = screen.getByText('Add tag')
    const button = screen.getByText('Search')

    // when
    fireEvent.change(input, { target: { value: 'test-input' } })
    fireEvent.click(tag)
    fireEvent.change(input, { target: { value: 'test-input' } })
    fireEvent.click(tag)
    fireEvent.click(button)

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled())
  })
})
