import { SetStateAction, useState } from "react";
import { useNavigate } from "react-router"

const MainPage = () => {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState("");

  const onChangeHandler = (event: { currentTarget: { value: SetStateAction<string>; }; }) =>{
    setKeyword(event.currentTarget.value);
  }

  const onClickHandler = ()=>{
    navigate(`/search/${keyword}`)
  }

  return (
    <div className="MainPage">
      <h1>MainPage</h1>
      <label>keyword<input type="text" value={keyword} onChange={onChangeHandler} /></label>
      <button onClick={onClickHandler} disabled={keyword===""}>search</button>
    </div>
  );
}

export default MainPage