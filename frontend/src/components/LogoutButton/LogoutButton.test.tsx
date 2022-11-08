import { screen, fireEvent, waitFor } from '@testing-library/react'
import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import LogoutButton from './LogoutButton'

const preloadedState: RootState = rootInitialState

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch
}))

describe('<LogoutButton />', () => {
  it('should handle click Button', async () => {
    // given
    renderWithProviders(<LogoutButton />, { preloadedState })
    const button = screen.getByRole('button')

    // when
    fireEvent.click(button)

    // then
    await waitFor(() => expect(mockDispatch).toHaveBeenCalled())
  })
})
