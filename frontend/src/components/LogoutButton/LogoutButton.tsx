import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import { requestLogout } from '../../store/slices/user/user'

const LogoutButton = () => {
  const dispatch = useDispatch<AppDispatch>()

  const clickLogoutHandler = async () => {
    dispatch(requestLogout())
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
