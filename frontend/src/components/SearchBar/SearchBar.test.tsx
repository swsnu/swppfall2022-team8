import { fireEvent, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import SearchBar from './SearchBar'

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate
}))
const mockAlert = jest.fn()
window.alert = mockAlert

const preloadedState = rootInitialState

describe('<SearchBar />', () => {
  it('should handle normal use case at MainPage (search by button)', async () => {
    // given
    await act(async () => {
      renderWithProviders(<SearchBar />, { preloadedState })
    })

    // when
    const authorButton = await screen.findByText('Author')
    fireEvent.click(authorButton)
    const authorInput = await screen.findByPlaceholderText('Author search')
    fireEvent.change(authorInput, { target: { value: 'TEST_AUTHOR' } })
    const searchButton = await screen.findByText('Search')
    fireEvent.click(searchButton)

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/search?author=TEST_AUTHOR'))
  })
  it('should reject search if tag name is invalid (search by enter key)', async () => {
    // given
    globalThis.alert = jest.fn()
    await act(async () => {
      renderWithProviders(<SearchBar />, { preloadedState })
    })

    // when
    const tagButton = await screen.findByText('Tag')
    fireEvent.click(tagButton)
    const tagInput = await screen.findByPlaceholderText('Tag search')
    fireEvent.keyPress(tagInput, { key: 'Enter', code: 13, charCode: 13 })
    fireEvent.change(tagInput, { target: { value: 'fake_tag1 fake_tag2' } })
    fireEvent.keyPress(tagInput, { key: 'Enter', code: 13, charCode: 13 })

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Tag should consist of alpabets/numbers/dashes only,\nand tags should be separated by single space.'))
  })
  it('should handle use case at BookListPage (normal search)', async () => {
    // given
    await act(async () => {
      renderWithProviders(<SearchBar author={'TEST_AUTHOR'}/>, { preloadedState })
    })

    // then
    await waitFor(() => expect(screen.getAllByText('Author').length).toEqual(2))
  })
  it('should handle use case at BookListPage (advanced search)', async () => {
    // given
    await act(async () => {
      renderWithProviders(<SearchBar title={'TEST_TITLE'} tag={['test-tag1', 'test-tag2']}/>, { preloadedState })
    })

    // then
    await waitFor(() => expect(screen.getAllByText('Advanced').length).toEqual(2))
  })
  it('should show hints if mouse is on tag search bar / remove hints if mouse goes out from tag search bar', async () => {
    // given
    await act(async () => {
      renderWithProviders(<SearchBar />, { preloadedState })
    })
    const tagButton = await screen.findByText('Tag')
    fireEvent.click(tagButton)

    // when
    const tagInput = await screen.findByPlaceholderText('Tag search')
    fireEvent.mouseOver(tagInput)

    // then
    const hint = await screen.findByText('Tag Search Hint')

    // when
    fireEvent.mouseOut(tagInput)

    // then
    await waitFor(() => expect(hint).not.toBeInTheDocument())
  })
})
