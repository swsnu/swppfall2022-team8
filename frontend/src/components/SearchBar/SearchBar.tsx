import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router";

interface IProps {
  initContent: string;
};

const SearchBar = (props: IProps) => {
  const [content, setContent] = useState<string>(props.initContent);

  const navigate = useNavigate();

  return (
    <>
      {/* TODO: add tag search, author search feature */}
      
      <InputGroup  className="mb-3"
      id="search-bar">
        <Form.Control
        placeholder="search"
        aria-label="Recipient's username"
        aria-describedby="basic-addon2"
        id="search-bar"
        value={content}
        onChange={event => setContent(event.target.value)}
        onKeyDown={event => { if(event.key === 'Enter') navigate(`/search/${content}`)}}
        />
        <Button variant="outline-primary" id="search-button"
        onClick={() => navigate(`/search/${content}`)}
        >
          Search
        </Button>
      </InputGroup>

{/*
      <input 
        id="search-bar"
        value={content}
        onChange={event => setContent(event.target.value)}
        onKeyDown={event => { if(event.key === 'Enter') navigate(`/search/${content}`)}}
      />
      <button 
        type="button"
        onClick={() => navigate(`/search/${content}`)}
  >Search</button>*/}
    </>
  )
};

export default SearchBar;