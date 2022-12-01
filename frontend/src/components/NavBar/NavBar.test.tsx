import { render } from '@testing-library/react'
import NavBar from './NavBar'

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
  it('should render without errors', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    })
    render(<NavBar />)
  })
})
