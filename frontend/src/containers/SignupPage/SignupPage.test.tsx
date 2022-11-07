import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import SignupPage from './SignupPage'

const preloadedState: RootState = rootInitialState

describe('<SignupPage />', () => {
  it('should render without error', () => {
    renderWithProviders(<SignupPage />, { preloadedState })
  })
})
