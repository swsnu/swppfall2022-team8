import { Navbar } from 'react-bootstrap'
import ChattingButton from '../ChattingButton/ChattingButton'
import LogoButton from '../LogoButton/LogoButton'
import LogoutButton from '../LogoutButton/LogoutButton'
import RegisterButton from '../RegisterButton/RegisterButton'
import UserStatusButton from '../UserStatusButton/UserStatusButton'
import './NavBar.css'

const NavBar = () => {
  return (
    <>
      <Navbar bg='light' expand='lg'>
        <div className='nav-logo'>
          <LogoButton />
        </div>
        <div className='nav-else'>
        <RegisterButton />
        <ChattingButton />
        <UserStatusButton />
        <LogoutButton />
        </div>
      </Navbar>
    </>
  )
}

export default NavBar
