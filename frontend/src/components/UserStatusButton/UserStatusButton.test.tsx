import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import UserStatusButton from './UserStatusButton'

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate
}))

describe('<UserStatusButton />', () => {
  it('should handle click Button', async () => {
    // given
    render(<UserStatusButton />)
    const button = screen.getByRole('button')

    // when
    fireEvent.click(button)

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled())
  })
})
