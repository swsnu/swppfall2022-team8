import { render } from '@testing-library/react'
import MainPage from './MainPage'

const spyNavBar = () => (
  <p>NavBar</p>
)

const spySearchBar = () => (
  <p>SearchBar</p>
)

jest.mock('../../components/NavBar/NavBar', () => spyNavBar)

jest.mock('../../components/SearchBar/SearchBar', () => spySearchBar)

describe('<MainPage />', () => {
  it('should render without error', () => {
    render(<MainPage />)
  })
})
