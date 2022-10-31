import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { AppDispatch } from '../../store'
import { requestLogout, selectUser } from '../../store/slices/user/user'

const LogoutButton = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const userState = useSelector(selectUser)

  const clickLogoutHandler = async () => {
    await dispatch(requestLogout(userState.currentUser?.id ?? NaN))
    navigate('/login')
  }

  return (
    <>
      <button
        type="button"
        onClick={() => clickLogoutHandler()}
      >Logout</button>
    </>
  )
}

export default LogoutButton
