import ChattingButton from '../../components/ChattingButton/ChattingButton'
import LogoButton from '../../components/LogoButton/LogoButton'
import LogoutButton from '../../components/LogoutButton/LogoutButton'
import RegisterButton from '../../components/RegisterButton/RegisterButton'
import UserStatusButton from '../../components/UserStatusButton/UserStatusButton'

const ChattingPage = () => {
  return (
    <>
      <LogoButton />
      <RegisterButton />
      <ChattingButton />
      <UserStatusButton />
      <LogoutButton />
      <br />
      <h1>ChattingPage</h1>
      <br />
    </>
  )
}

export default ChattingPage
