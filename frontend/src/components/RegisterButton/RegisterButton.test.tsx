import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import RegisterBUtton from './RegisterButton'

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate
}))

describe('<RegisterButton />', () => {
  it('should handle click Button', async () => {
    // given
    render(<RegisterBUtton />)
    const button = screen.getByRole('button')

    // when
    fireEvent.click(button)

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled())
  })
})
