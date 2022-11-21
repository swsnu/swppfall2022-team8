import { faComments } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { AppDispatch } from '../../store'
import { roomActions } from '../../store/slices/room/room'
import './ChattingButton.css'

const ChattingButton = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const clickButtonHandler = () => {
    dispatch(roomActions.clearRoom())
    navigate('/chat')
  }

  return (
    <div className='chat'>
      <Button
        id="chat-button"
        type="button"
        variant='light'
        onClick={() => clickButtonHandler()}
      ><h5><FontAwesomeIcon
          id='chat-icon'
          icon={faComments}
        /> Chat</h5>
      </Button>
    </div>
  )
}

export default ChattingButton
