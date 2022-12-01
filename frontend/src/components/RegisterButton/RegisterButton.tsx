import { useNavigate } from 'react-router'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import './RegisterButton.css'

const RegisterButton = () => {
  const navigate = useNavigate()

  const clickRegisterButtonHandler = () => {
    window.scrollTo(0, 0)
    navigate('/book/register')
  }

  return (
    <div className='register'>
      <Button
        variant='light'
        type="button"
        onClick={() => clickRegisterButtonHandler()}
        id="register-button"
      ><h5><FontAwesomeIcon
          id='register-icon'
          icon={faPenToSquare}
        /> Register</h5>
      </Button>
    </div>
  )
}

export default RegisterButton
