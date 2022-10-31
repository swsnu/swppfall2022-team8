import ChattingButton from '../../components/ChattingButton/ChattingButton'
import LogoButton from '../../components/LogoButton/LogoButton'
import LogoutButton from '../../components/LogoutButton/LogoutButton'
import RegisterButton from '../../components/RegisterButton/RegisterButton'
import SearchBar from '../../components/SearchBar/SearchBar'
import UserStatusButton from '../../components/UserStatusButton/UserStatusButton'

const MainPage = () => {
  return (
    <>
      <LogoButton />
      <RegisterButton />
      <ChattingButton />
      <UserStatusButton />
      <LogoutButton />
      <br />
      <h1>MainPage</h1>
      <br />

      <SearchBar initContent="" />

      {/* TODO: add ML recommendation feature */}
    </>
  )
}

export default MainPage
