import { waitFor } from '@testing-library/react'
import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import RecommendEntity from './RecommendEntity'

const preloadedState: RootState = rootInitialState

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate
}))

describe('<RecommendEntity />', () => {
  it('should handle onClick', async () => {
    // given
    const { container } = renderWithProviders(<RecommendEntity idx={1} image='' title='test-title' />, { preloadedState })
    const info = container.getElementsByTagName('p').item(0)

    // when
    info?.click()

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled())
  })
})
