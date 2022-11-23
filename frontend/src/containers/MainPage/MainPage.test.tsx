import { render } from '@testing-library/react'
import MainPage from './MainPage'

const spyNavBar = () => <p>NavBar</p>
const spySearchBar = () => <p>SearchBar</p>
const spyRecommend = () => <p>Recommend</p>

jest.mock('../../components/NavBar/NavBar', () => spyNavBar)
jest.mock('../../components/SearchBar/SearchBar', () => spySearchBar)
jest.mock('../../components/Recommend/Recommend', () => spyRecommend)

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  Navigate: (props: any) => {
    mockNavigate(props.to)
    return null
  },
  useNavigate: () => mockNavigate
}))

describe('<MainPage />', () => {
  it('should render without error', () => {
    render(<MainPage />)
  })
})
