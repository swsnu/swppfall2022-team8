import { useState } from 'react'
import { Carousel } from 'react-bootstrap'
import Recommend from '../../components/Recommend/Recommend'
import RegisterButton from '../../components/RegisterButton/RegisterButton'
import SearchBar from '../../components/SearchBar/SearchBar'

import './MainPage.css'

const interval = 10000

const MainPage = () => {
  const [carouselIdx, setCarouselIdx] = useState(0)

  return (
    <div className='page-no-lr-padding'>
      <div id='main-searchbar'>
        <SearchBar />
      </div>
      <Carousel
        activeIndex={carouselIdx}
        onSelect={(selectedIndex) => setCarouselIdx(selectedIndex)}
        pause={false}
        id='carousel'
        variant='dark'
      >
        <Carousel.Item interval={interval}>
          <div id='main-description'>
            <div>
              <h1 id='welcome-h1'><b>Welcome to BookVillage!</b></h1>
              <h2 id='welcome-description'>Borrow or lend books each other.</h2>
            </div>
            <div className='image-div'>
              <img id='welcome-book-image1' src='img/bocchi.jfif' alt='no image' />
              <img id='welcome-book-image2' src='img/prince.png' alt='no image' />
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item interval={interval}>
          <div id='main-register'>
            <div className='image-div'>
              <img id='register-book-image1' src='img/linear.png' alt='no image' />
              <img id='register-book-image2' src='img/isesuma.jpg' alt='no image' />
            </div>
            <div>
              <h2 id='register-h2'><b>Register your book and lend it to other people!</b></h2>
              <br />
              <br />
              <div id='main-register-button'><RegisterButton /></div>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>
      <div id='main-recommend'>
        <br />
        <h1><b>Recommendation For You...</b></h1>
        <Recommend />
      </div>
    </div>
  )
}

export default MainPage
