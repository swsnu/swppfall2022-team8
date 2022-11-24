import { fireEvent, render, waitFor } from '@testing-library/react'
import BookListEntity from './BookListEntity'

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate
}))

describe('<BookListEntity />', () => {
  it('should navigate when clicked', async () => {
    // given
    const { container } = render(
      <BookListEntity id={1} image='' title='test-title' available={false} />
    )
    const button = container.getElementsByClassName('book-list-entity')

    // when
    fireEvent.click(button[0])

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/book/1'))
  })
})
