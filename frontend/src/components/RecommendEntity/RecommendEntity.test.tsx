import { render, waitFor } from '@testing-library/react'
import RecommendEntity from './RecommendEntity'

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate
}))

describe('<RecommendEntity />', () => {
  it('should handle onClick', async () => {
    // given
    const { container } = render(<RecommendEntity idx={1} image='' title='test-title' />)
    const info = container.getElementsByTagName('p').item(0)

    // when
    info?.click()

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled())
  })
})
