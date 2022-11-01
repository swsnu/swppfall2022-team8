import NavBar from '../../components/NavBar/NavBar'
import SearchBar from '../../components/SearchBar/SearchBar'

const MainPage = () => {
  return (
    <>
      <NavBar />
      <h1>MainPage</h1>
      <br />

      <SearchBar initContent="" />

      {/* TODO: add ML recommendation feature */}
    </>
  )
}

export default MainPage
