import { fireEvent, screen, waitFor, render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import SearchBar from './SearchBar'

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate
}))
const mockAlert = jest.fn()
window.alert = mockAlert

describe('<SearchBar />', () => {
  it('should handle normal use case at MainPage (search by button)', async () => {
    // given
    await act(async () => {
      render(<SearchBar />)
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
      render(<SearchBar />)
    })

    // when
    const tagButton = await screen.findByText('Tag')
    fireEvent.click(tagButton)
    const tagInput = await screen.findByPlaceholderText('Tag search')
    fireEvent.keyDown(tagInput, { key: 'Ctrl' })
    fireEvent.change(tagInput, { target: { value: 'fake_tag1 fake_tag2' } })
    fireEvent.keyDown(tagInput, { key: 'Enter' })

    // then
    await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Tag should consist of alpabets/numbers/dashes only,\nand tags should be separated by single space.'))
  })
  it('should handle use case at BookListPage (normal search)', async () => {
    // given
    await act(async () => {
      render(<SearchBar author={'TEST_AUTHOR'}/>)
    })

    // then
    await waitFor(() => expect(screen.getAllByText('Author').length).toEqual(2))
  })
  it('should handle use case at BookListPage (advanced search)', async () => {
    // given
    await act(async () => {
      render(<SearchBar title={'TEST_TITLE'} tag={['test-tag1', 'test-tag2']}/>)
    })

    // then
    await waitFor(() => expect(screen.getAllByText('Advanced').length).toEqual(2))
  })
  it('should show hints if mouse is on tag search bar / remove hints if mouse goes out from tag search bar', async () => {
    // given
    await act(async () => {
      render(<SearchBar />)
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
