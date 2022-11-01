import ChattingButton from '../ChattingButton/ChattingButton'
import LogoButton from '../LogoButton/LogoButton'
import LogoutButton from '../LogoutButton/LogoutButton'
import RegisterButton from '../RegisterButton/RegisterButton'
import UserStatusButton from '../UserStatusButton/UserStatusButton'

const NavBar = () => {
  return (
    <>
      <LogoButton />
      <RegisterButton />
      <ChattingButton />
      <UserStatusButton />
      <LogoutButton />
      <br />
    </>
  )
}

export default NavBar
