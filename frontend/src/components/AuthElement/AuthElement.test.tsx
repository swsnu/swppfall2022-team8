import { screen, waitFor } from '@testing-library/react'
import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import AuthElement from './AuthElement'

const fakeUser = {
  id: 1,
  username: 'test_username'
}

const preloadedState: RootState = rootInitialState

const preloadedLoginState: RootState = {
  ...preloadedState,
  user: {
    ...preloadedState.user,
    currentUser: fakeUser
  }
}

const spyNavBar = () => <p>NavBar</p>
jest.mock('../../components/NavBar/NavBar', () => spyNavBar)

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  Navigate: (props: any) => {
    mockNavigate(props.to)
    return null
  },
  useNavigate: () => mockNavigate
}))

describe('<AuthElement />', () => {
  it('should render auth=true, login=true', async () => {
    // given
    renderWithProviders(
      <AuthElement auth={true} element={<p>test-auth</p>} />,
      { preloadedState: preloadedLoginState }
    )

    // then
    const testElement = await screen.findByText('test-auth')
    expect(testElement.innerHTML).toEqual('test-auth')
  })
  it('should render auth=true, login=false', async () => {
    // given
    renderWithProviders(
      <AuthElement auth={true} element={<p>test-auth</p>} />,
      { preloadedState }
    )

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'))
  })
  it('should render auth=false, login=true', async () => {
    // given
    renderWithProviders(
      <AuthElement auth={false} element={<p>test-auth</p>} />,
      { preloadedState: preloadedLoginState }
    )

    // then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/main'))
  })
  it('should render auth=false, login=false', async () => {
    // given
    renderWithProviders(
      <AuthElement auth={false} element={<p>test-auth</p>} />,
      { preloadedState }
    )

    // then
    const testElement = await screen.findByText('test-auth')
    expect(testElement.innerHTML).toEqual('test-auth')
  })
})
