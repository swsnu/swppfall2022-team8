import { useNavigate } from "react-router";

import "./LogoButton.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  { faBook, faBookOpen  } from '@fortawesome/free-solid-svg-icons';
import Button from "react-bootstrap/Button";

const LogoButton = () => {
  const navigate = useNavigate();
  
  return (
    <div className="logo">
      
      <Button
        id="logo-button" 
        type="button"
        variant="light"
        onClick={() => navigate("/main")}
      ><FontAwesomeIcon 
      className="book-image"
      icon={faBookOpen}/><h3>BookVillage</h3></Button>
    </div>
  )
};

export default LogoButton;