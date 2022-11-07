import { render } from '@testing-library/react'
import MainPage from './MainPage'

const spyNavBar = () => <p>NavBar</p>
const spySearchBar = () => <p>SearchBar</p>
const spyRecommend = () => <p>Recommend</p>

jest.mock('../../components/NavBar/NavBar', () => spyNavBar)
jest.mock('../../components/SearchBar/SearchBar', () => spySearchBar)
jest.mock('../../components/Recommend/Recommend', () => spyRecommend)

describe('<MainPage />', () => {
  it('should render without error', () => {
    render(<MainPage />)
  })
})
