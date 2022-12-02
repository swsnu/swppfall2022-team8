import { useEffect, useRef, useState } from 'react'
import { Button, Dropdown, DropdownButton, Form, InputGroup, Overlay, Popover, ListGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import QueryString from 'qs'

import './SearchBar.css'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../store'
import { fetchQueryTags, selectBook } from '../../store/slices/book/book'
import useInterval from '../../utils/useInterval'

interface IProps {
  title?: string
  author?: string
  tag?: string[]
};

const SearchBar = (props: IProps) => {
  const [inputs, setInputs] = useState<string[]>(['', '', ''])
  const [dropdownIdx, setDropdownIdx] = useState<number>(0)
  const [hintShow, setHintShow] = useState<boolean>(false)
  const [hintTarget, setHintTarget] = useState<HTMLElement | null>(null)
  const [listShow, setListShow] = useState<boolean>(false)
  const [listTarget, setListTarget] = useState<HTMLElement | null>(null)
  const prevTagInput = useRef<string>('')

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const bookState = useSelector(selectBook)

  const categories = ['Title', 'Author', 'Tag']
  const dropdowns = [...categories, 'Advanced']

  useEffect(() => {
    const entries = [props.title ?? '', props.author ?? '', props.tag?.join(' ') ?? '']
    const filledNum = entries.filter(val => Boolean(val)).length
    if (filledNum >= 2) {
      setDropdownIdx(3)
    } else if (filledNum === 1) {
      setDropdownIdx(entries.map(val => Boolean(val)).indexOf(true))
    }
    setInputs(entries)
  }, [])

  useInterval(() => {
    if (listTarget === document.activeElement && inputs[2] !== prevTagInput.current) {
      const name = inputs[2].split(' ').pop()
      if (name) {
        dispatch(fetchQueryTags({ name }))
      }
      setListShow(Boolean(name))
      prevTagInput.current = inputs[2]
    }
  }, 200)

  const changeInputHandler = (value: string, idx: number) => {
    const newInputs = [...inputs]
    newInputs[idx] = value
    setInputs(newInputs)
  }

  const appendTagHandler = (name: string) => {
    listTarget?.focus()
    const tags = inputs[2].split(' ')
    tags[tags.length - 1] = name
    tags.push('')
    changeInputHandler(tags.join(' '), 2)
  }

  const clickDropDownHandler = (idx: number) => {
    setDropdownIdx(idx)
    setInputs(['', '', ''])
  }

  const clickSearchHandler = () => {
    const params = {
      title: inputs[0].trim() || undefined,
      author: inputs[1].trim() || undefined,
      tag: inputs[2].trim() ? inputs[2].trim().split(' ') : undefined
    }

    if (params.tag && !params.tag.every(tag => /^[0-9A-Za-z-]+$/.test(tag))) {
      alert('Tag should consist of alpabets/numbers/dashes only,\nand tags should be separated by single space.')
      return
    }

    navigate(`/search?${QueryString.stringify(params)}`)
  }

  return (
    <div id='search'>
      <br />
      <InputGroup className="mb-3" id="search-bar">
        <DropdownButton
          variant="outline-primary"
          title={dropdowns[dropdownIdx]}
          id="search-category-dropdown"
        >
          {dropdowns.map((dropdown, idx) => (
            <Dropdown.Item
              key={`search-dropdown-${idx}`}
              href="#"
              onClick={() => clickDropDownHandler(idx)}
            >{dropdown}</Dropdown.Item>
          ))}
        </DropdownButton>
        {categories.map((category, idx) => (
          <Form.Control
            key={`search-bar-${category.toLowerCase()}`}
            hidden={dropdowns[dropdownIdx] !== 'Advanced' && dropdowns[dropdownIdx] !== category}
            autoComplete="off"
            placeholder={`${category} search`}
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            id={`search-bar-${category.toLowerCase()}`}
            value={inputs[idx]}
            onChange={event => changeInputHandler(event.target.value, idx)}
            onKeyDown={event => { if (event.key === 'Enter') clickSearchHandler() }}
            {...(
              category === 'Tag'
                ? {
                    onMouseOver: event => { setHintShow(true); setHintTarget(event.currentTarget) },
                    onMouseOut: _event => { setHintShow(false) },
                    onFocus: event => { setListShow(Boolean(inputs[2])); setListTarget(event.currentTarget) },
                    onBlur: _event => { setListShow(false) }
                  }
                : null
            )}
          />
        ))}
        <Overlay
          show={hintShow}
          target={hintTarget}
          placement="left"
          container={null}
          containerPadding={0}
        >
          <Popover id="hint-tag-hint">
            <Popover.Header as="h3">Tag Search Hint</Popover.Header>
            <Popover.Body>
              &middot; A tag consists of alpabets, numbers, and dashes only.<br />
              &middot; Tags are separated by single space.<br /><br />
              Ex&#41; classics science-fiction-fantasy
            </Popover.Body>
          </Popover>
        </Overlay>
        <Overlay
          show={listShow}
          target={listTarget}
          placement="bottom"
          container={null}
          containerPadding={0}
        >
          <ListGroup style={{ width: listTarget?.clientWidth ?? 0 }}>
            {bookState.tags.map((tag, idx) => (
              <ListGroup.Item
                key={`tag_${tag.name}_${idx}`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => { appendTagHandler(tag.name) }}
              >{tag.name}</ListGroup.Item>
            ))}
          </ListGroup>
        </Overlay>
        <Button
          id="search-button"
          variant="outline-primary"
          disabled={inputs.map(input => input.trim()).every(input => !input)}
          onClick={() => clickSearchHandler()}
        >
          Search
        </Button>
      </InputGroup>
    </div>
  )
}

export default SearchBar
