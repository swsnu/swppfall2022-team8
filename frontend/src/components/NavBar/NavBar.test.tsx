import { screen } from '@testing-library/react'
import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import NavBar from './NavBar'

const preloadedState: RootState = rootInitialState

const spyLogoButton = () => (
  <div data-testid='spyLogoButton'>spyLogoButton</div>
)
jest.mock('../LogoButton/LogoButton', () => spyLogoButton)
const spyRegisterButton = () => (
  <div data-testid='spyRegisterButton'>spyRegisterButton</div>
)
jest.mock('../RegisterButton/RegisterButton', () => spyRegisterButton)
const spyChattingButton = () => (
  <div data-testid='spyChattingButton'>spyChattingButton</div>
)
jest.mock('../ChattingButton/ChattingButton', () => spyChattingButton)
const spyUserStatusButton = () => (
  <div data-testid='spyUserStatusButton'>spyUserStatusButton</div>
)
jest.mock('../UserStatusButton/UserStatusButton', () => spyUserStatusButton)
const spyLogoutButton = () => (
  <div data-testid='spyLogoutButton'>spyLogoutButton</div>
)
jest.mock('../LogoutButton/LogoutButton', () => spyLogoutButton)

describe('<NavBar />', () => {
  it('should render components', async () => {
    // given
    renderWithProviders(<NavBar />, { preloadedState })

    const logobutton = screen.getByTestId('spyLogoButton')
    const registerbutton = screen.getByTestId('spyRegisterButton')
    const chattingbutton = screen.getByTestId('spyChattingButton')
    const userstatusbutton = screen.getByTestId('spyUserStatusButton')
    const logoutbutton = screen.getByTestId('spyLogoutButton')

    // when

    // then
    expect(logobutton.innerHTML).toEqual('spyLogoButton')
    expect(registerbutton.innerHTML).toEqual('spyRegisterButton')
    expect(chattingbutton.innerHTML).toEqual('spyChattingButton')
    expect(userstatusbutton.innerHTML).toEqual('spyUserStatusButton')
    expect(logoutbutton.innerHTML).toEqual('spyLogoutButton')
  })
})
