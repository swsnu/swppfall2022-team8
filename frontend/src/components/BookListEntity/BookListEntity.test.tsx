import { fireEvent, waitFor } from '@testing-library/react'
import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import BookListEntity from './BookListEntity'

const preloadedState: RootState = rootInitialState

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate
}))

describe('<BookListEntity />', () => {
  it('should navigate when clicked (available)', async () => {
    // given
    const { container } = renderWithProviders(
      <BookListEntity id={1} image='' title='test-title' available={false} />,
      { preloadedState }
    )
    const button = container.getElementsByClassName('book-list-entity')

    // when
    fireEvent.click(button[0])

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/book/1'))
  })
  it('should navigate when clicked (borrowed)', async () => {
    // given
    const { container } = renderWithProviders(
      <BookListEntity id={1} image='' title='test-title' available={true} />,
      { preloadedState }
    )
    const info = container.getElementsByTagName('h2')

    // then
    expect(info.item(1)?.innerHTML).toEqual('  Available!')
  })
})
