import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import { fetchRecommend, requestLogout } from '../../store/slices/user/user'
import './LogoutButton.css'

const LogoutButton = () => {
  const dispatch = useDispatch<AppDispatch>()

  const clickLogoutHandler = async () => {
    await dispatch(fetchRecommend())
    dispatch(requestLogout())
  }

  return (
    <div className='logout'>
      <Button
        type="button"
        id="logout-button"
        variant='light'
        onClick={() => clickLogoutHandler()}
      ><h5><FontAwesomeIcon
          icon={faRightFromBracket}
          id='logout-icon'
        /> Logout</h5>
      </Button>
    </div>
  )
}

export default LogoutButton
