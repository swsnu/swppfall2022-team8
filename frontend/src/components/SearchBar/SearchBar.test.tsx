import { fireEvent, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
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
  it('should handle author search at MainPage (search by button)', async () => {
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
  it('should handle tag search at MainPage (search by button)', async () => {
    // given
    await act(async () => {
      renderWithProviders(<SearchBar />, { preloadedState })
    })

    // when
    const tagButton = await screen.findByText('Tag')
    fireEvent.click(tagButton)
    const tagInput = await screen.findByPlaceholderText('Tag search')
    fireEvent.change(tagInput, { target: { value: 'TEST_TAG' } })
    const searchButton = await screen.findByText('Search')
    fireEvent.click(searchButton)

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/search?tag%5B0%5D=TEST_TAG'))
  })
  it('should handle title search case at MainPage (search by Enter)', async () => {
    // given
    await act(async () => {
      renderWithProviders(<SearchBar />, { preloadedState })
    })

    // when
    const titleButton = (await screen.findAllByText('Title'))[0]
    fireEvent.click(titleButton)
    const titleInput = await screen.findByPlaceholderText('Title search')
    fireEvent.keyPress(titleInput, { key: 'Enter', code: 13, charCode: 13 })
    fireEvent.change(titleInput, { target: { value: 'TEST_TITLE' } })
    fireEvent.keyPress(titleInput, { key: 'Enter', code: 13, charCode: 13 })

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/search?title=TEST_TITLE'))
  })
  it('should handle use case at BookListPage (normal search)', async () => {
    // given
    await act(async () => {
      renderWithProviders(<SearchBar author={'TEST_AUTHOR'} />, { preloadedState })
    })

    // then
    await waitFor(() => expect(screen.getAllByText('Author').length).toEqual(2))
  })
  it('should handle use case at BookListPage (advanced search)', async () => {
    // given
    await act(async () => {
      renderWithProviders(<SearchBar title={'TEST_TITLE'} tag={['test-tag1', 'test-tag2']} />, { preloadedState })
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
  it('should handle autocomplete', async () => {
    // given
    jest.useFakeTimers()
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ data: [{ id: 1, name: 'FAKE_TAG' }] }))
    await act(async () => {
      renderWithProviders(<SearchBar />, { preloadedState })
    })
    await act(async () => {
      const tagButton = await screen.findByText('Tag')
      fireEvent.click(tagButton)
    })
    jest.runOnlyPendingTimers()

    // when
    await act(async () => {
      const tagInput = await screen.findByPlaceholderText('Tag search')
      tagInput.focus()
      tagInput.blur()
      tagInput.focus()
      fireEvent.change(tagInput, { target: { value: 'FAKE' } })
      jest.runOnlyPendingTimers()
    })

    // then
    const completeElem = await screen.findByText('FAKE_TAG')

    // when
    await act(async () => {
      fireEvent.mouseDown(completeElem)
      fireEvent.click(completeElem)
    })

    // then
    await waitFor(() => expect(completeElem).not.toBeInTheDocument())
  })
})
