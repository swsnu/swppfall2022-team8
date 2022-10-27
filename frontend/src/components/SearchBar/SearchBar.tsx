import { useState } from 'react'
import { useNavigate } from 'react-router'

interface IProps {
  initContent: string
};

const SearchBar = (props: IProps) => {
  const [content, setContent] = useState<string>(props.initContent)

  const navigate = useNavigate()

  return (
    <>
      {/* TODO: add tag search, author search feature */}
      <input
        id="search-bar"
        value={content}
        onChange={event => setContent(event.target.value)}
        onKeyDown={event => { if (event.key === 'Enter') navigate(`/search/${content}`) }}
      />
      <button
        type="button"
        onClick={() => navigate(`/search/${content}`)}
      >Search</button>
    </>
  )
}

export default SearchBar
