import ChattingButton from "../../components/ChattingButton/ChattingButton";
import LogoButton from "../../components/LogoButton/LogoButton";
import RegisterButton from "../../components/RegisterButton/RegisterButton";
import SearchBar from "../../components/SearchBar/SearchBar";

const MainPage = () => {
  return (
    <>
      <LogoButton />
      <RegisterButton />
      <ChattingButton />
      <br/>
      <h1>MainPage</h1>
      <br/>

      <SearchBar initContent="" />

      {/* TODO: add ML recommendation feature */}
    </>
  );
}

export default MainPage