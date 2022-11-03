import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import './UserStatusButton.css'

const UserStatusButton = () => {
  const navigate = useNavigate()

  return (
    <div className='user-status'>
      <Button
        type="button"
        id='user-status-button'
        variant='light'
        onClick={() => navigate('/status')}
      ><h5><FontAwesomeIcon
          icon={faUser}
          id='user-icon'
        /> User</h5>
      </Button>
    </div>
  )
}

export default UserStatusButton
