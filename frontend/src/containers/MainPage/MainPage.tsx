import NavBar from '../../components/NavBar/NavBar'
import Recommend from '../../components/Recommend/Recommend'
import RegisterButton from '../../components/RegisterButton/RegisterButton'
import SearchBar from '../../components/SearchBar/SearchBar'

import './MainPage.css'

const MainPage = () => {
  return (
    <div className='page'>
      <NavBar />
      <div id='main-searchbar'>
        <SearchBar />
      </div>
      <div id='main-description'>
        <div>
          <h1 id='welcome-h1'><b>Welcome to BookVillage!</b></h1>
          <h2 id='welcome-description'>Borrow or lend books each other.</h2>
        </div>
        <div id='image-div'>
          <img id='welcome-book-image1' src='img/isesuma.jpg' alt='no image'/>
          <img id='welcome-book-image2' src='img/heun.jpg' alt='no image' />
        </div>
      </div>
      <div id='main-register'>
        Register your book and lend it to other people
        <RegisterButton />
      </div>
      <div id='main-recommend'>
        <Recommend />
      </div>
    </div>
  )
}

export default MainPage
