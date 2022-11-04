import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import NavBar from '../../components/NavBar/NavBar'
import SearchBar from '../../components/SearchBar/SearchBar'
import { AppDispatch } from '../../store'
import { fetchTags, selectUser } from '../../store/slices/user/user'

const MainPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const userState = useSelector(selectUser)

  useEffect(() => {
    if (!userState.currentUser) {
      navigate('/login')
    } else {
      dispatch(fetchTags())
    }
  }, [navigate, dispatch])

  return (
    <>
      <NavBar />
      <h1>MainPage</h1>
      <br />

      <SearchBar />

      {/* TODO: add ML recommendation feature */}
    </>
  )
}

export default MainPage
