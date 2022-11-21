import { useEffect, useState } from 'react'
import { Button, Dropdown, DropdownButton, Form, InputGroup, Overlay, Popover } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import QueryString from 'qs'

interface IProps {
  title?: string
  author?: string
  tag?: string[]
};

const SearchBar = (props: IProps) => {
  const [inputs, setInputs] = useState<string[]>(['', '', ''])
  const [dropdownIdx, setDropdownIdx] = useState<number>(0)
  const [popoverShow, setPopoverShow] = useState<boolean>(false)
  const [popoverTarget, setPopoverTarget] = useState<HTMLElement | null>(null)

  const navigate = useNavigate()

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

  const changeInputHandler = (value: string, idx: number) => {
    const newInputs = [...inputs]
    newInputs[idx] = value
    setInputs(newInputs)
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
    <>
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
                    onMouseOver: event => { setPopoverShow(true); setPopoverTarget(event.currentTarget) },
                    onMouseOut: _event => { setPopoverShow(false) }
                  }
                : null
            )}
          />
        ))}
        <Overlay
          show={popoverShow}
          target={popoverTarget}
          placement="bottom-start"
          container={null}
          containerPadding={0}
        >
          <Popover id="popover-tag-hint">
            <Popover.Header as="h3">Tag Search Hint</Popover.Header>
            <Popover.Body>
              &middot; A tag consists of alpabets, numbers, and dashes only.<br />
              &middot; Tags are separated by single space.<br /><br />
              Ex&#41; classics science-fiction-fantasy
            </Popover.Body>
          </Popover>
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
    </>
  )
}

export default SearchBar
