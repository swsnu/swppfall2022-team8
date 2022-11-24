import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import LogoButton from './LogoButton'

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate
}))

describe('<LogoButton />', () => {
  it('should handle click Button', async () => {
    // given
    render(<LogoButton />)
    const button = screen.getByRole('button')

    // when
    fireEvent.click(button)

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled())
  })
})
