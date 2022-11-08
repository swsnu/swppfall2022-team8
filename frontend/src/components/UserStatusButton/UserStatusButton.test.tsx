import { fireEvent, screen, waitFor } from '@testing-library/react'
import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import UserStatusButton from './UserStatusButton'

const preloadedState: RootState = rootInitialState

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate
}))

describe('<UserStatusButton />', () => {
  it('should handle click Button', async () => {
    // given
    renderWithProviders(<UserStatusButton />, { preloadedState })
    const button = screen.getByRole('button')

    // when
    fireEvent.click(button)

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled())
  })
})
