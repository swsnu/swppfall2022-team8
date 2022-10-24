import { useState } from "react";
import { useNavigate } from "react-router"

const MainPage = () => {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState("");

  return (
    <div className="MainPage">
      <label>
        keyword
        <input 
          type="text" 
          value={keyword} 
          onChange={event => setKeyword(event.target.value)} 
        />
      </label>
      <button onClick={() => navigate(`/search/${keyword}`)} disabled={keyword===""}>search</button>
    </div>
  );
}

export default MainPage