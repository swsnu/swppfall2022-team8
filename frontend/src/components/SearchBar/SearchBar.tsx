import { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import QueryString from 'qs'

interface IProps {
  title?: string
  author?: string
  tag?: string[]
};

const SearchBar = (props: IProps) => {
  const [content, setContent] = useState<string>('')
  const [title, setTitle] = useState<string>(props.title ?? '')
  const [author, setAuthor] = useState<string>(props.author ?? '')
  const [tags, setTags] = useState<string[]>(props.tag ?? [])

  const navigate = useNavigate()

  const clickAddTitleHandler = () => {
    setTitle(content.trim())
    setContent('')
  }

  const clickAddAuthorHandler = () => {
    setAuthor(content.trim())
    setContent('')
  }

  const clickAddTagHandler = () => {
    if (content && (tags.find(val => val === content) === undefined)) {
      if (/^[0-9A-Za-z\s-]+$/.test(content)) {
        const newTags = [...tags, content.trim().toLowerCase().replace(' ', '-')]
        setTags(newTags)
      } else {
        alert('Tag should consist of alpabets, numbers and dashes(or whitespaces) only.')
        return
      }
    }
    setContent('')
  }

  const clickResetHandler = () => {
    setContent('')
    setTitle('')
    setAuthor('')
    setTags([])
  }

  const clickDeleteTagHandler = (targetIdx: number) => {
    const newTags = tags.filter((_tag, idx) => (idx !== targetIdx))
    setTags(newTags)
  }

  const clickSearchHandler = () => {
    if (title || author || tags.length) {
      const params = {
        title: title || undefined,
        author: author || undefined,
        tag: tags
      }
      navigate(`/search?${QueryString.stringify(params)}`)
    } else {
      alert('Search parameter cannot be empty.')
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => clickAddTitleHandler()}
      >&nbsp;Add title&nbsp;</button>
      <button
        type="button"
        onClick={() => clickAddAuthorHandler()}
      >&nbsp;Add author&nbsp;</button>
      <button
        type="button"
        onClick={() => clickAddTagHandler()}
      >&nbsp;Add tag&nbsp;</button>
      <button
        type="button"
        onClick={() => clickResetHandler()}
      >&nbsp;Reset&nbsp;</button>
      <br />
      <InputGroup className="mb-3"
        id="search-bar">
        <Form.Control
          placeholder="search"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          id="search-bar"
          value={content}
          onChange={event => setContent(event.target.value)}
        />
        <Button variant="outline-primary" id="search-button"
          onClick={() => clickSearchHandler()}
        >
          Search
        </Button>
      </InputGroup>
      {title && (
        <div>
          Title: {title}
          <button type="button" onClick={() => setTitle('')}>&nbsp;x&nbsp;</button>
        </div>
      )}
      {author && (
        <div>
          Author: {author}
          <button type="button" onClick={() => setAuthor('')}>&nbsp;x&nbsp;</button>
        </div>
      )}
      {tags.map((tag, idx) => (
        <div key={`tag_${tag}_${idx}`}>
          #{tag}
          <button type="button" onClick={() => clickDeleteTagHandler(idx)}>&nbsp;x&nbsp;</button>
        </div>
      ))}
    </>
  )
}

export default SearchBar
