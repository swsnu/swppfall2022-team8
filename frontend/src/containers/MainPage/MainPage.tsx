import NavBar from '../../components/NavBar/NavBar'
import Recommend from '../../components/Recommend/Recommend'
import SearchBar from '../../components/SearchBar/SearchBar'

const MainPage = () => {
  return (
    <>
      <NavBar />
      <h1>MainPage</h1>
      <br />

      <SearchBar />

      {/* TODO: add ML recommendation feature */}
      <Recommend />
    </>
  )
}

export default MainPage
