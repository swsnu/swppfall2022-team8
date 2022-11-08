import { fireEvent, waitFor } from '@testing-library/react'
import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import ChattingButton from './ChattingButton'

const preloadedState: RootState = rootInitialState

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate
}))

describe('<ChattingButton />', () => {
  it('should render', async () => {
    // given
    const { container } = renderWithProviders(
      <ChattingButton />,
      { preloadedState }
    )
    const button = container.querySelector('#chat-button')

    // when
    expect(button).not.toBe(null)
    if (button != null) {
      fireEvent.click(button)
    }

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/chat'))
  })
})
