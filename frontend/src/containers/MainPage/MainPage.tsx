import NavBar from '../../components/NavBar/NavBar'
import Recommend from '../../components/Recommend/Recommend'
import SearchBar from '../../components/SearchBar/SearchBar'

import './MainPage.css'

const MainPage = () => {
  return (
    <div className='page'>
      <NavBar />
      <br />
      <h1>Welcome to BookVillage!</h1>
      <br />
      <br />
      <h3 id='description-text'>
        You can borrow or lend books in BookVillage freely!
      </h3>

      <SearchBar />

      <Recommend />
    </div>
  )
}

export default MainPage
