import { faComments } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import './ChattingButton.css'

const ChattingButton = () => {
  const navigate = useNavigate()

  return (
    <div className='chat'>
      <Button
        id="chat-button"
        type="button"
        variant='light'
        onClick={() => navigate('/chat')}
      ><h5><FontAwesomeIcon
          id='chat-icon'
          icon={faComments}
        /> Chat</h5>
      </Button>
    </div>
  )
}

export default ChattingButton
