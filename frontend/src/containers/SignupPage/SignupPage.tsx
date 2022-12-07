import { useState } from 'react'
import { Button, Form, InputGroup, Overlay, Popover, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux'

import { AppDispatch } from '../../store'
import { requestSignup, updateTag } from '../../store/slices/user/user'

import './SignupPage.css'

const SignupPage = () => {
  const tagExamples: string[] = ['fantasy', 'nonfiction', 'novel', 'science', 'superhero', 'anime', 'comic', 'fiction', 'game']
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [tags, setTags] = useState<boolean[]>([...Array(tagExamples.length)].map(() => false))

  const [hintShow1, setHintShow1] = useState<boolean>(false)
  const [hintShow2, setHintShow2] = useState<boolean>(false)
  const [hintTarget1, setHintTarget1] = useState<HTMLElement | null>(null)
  const [hintTarget2, setHintTarget2] = useState<HTMLElement | null>(null)
  const hint1 = 'Username should be minimum 6 alphabets.'
  const hint2 = 'Password should be minimum 8 characters, at least one alphabet and one number'

  const dispatch = useDispatch<AppDispatch>()

  const clickSubmitHandler = async () => {
    if (password !== confirmPassword) {
      alert('Please check your password.')
      return
    }

    if (tags.every(val => !val)) {
      alert('Please select at least one tag.')
      return
    }

    const exp1: RegExp = /^[a-zA-Z]{6,}$/
    const exp2: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    let flag1 = false
    let flag2 = false
    if (exp1.test(username)) flag1 = true
    if (exp2.test(password)) flag2 = true

    if (flag1 && flag2) {
      const response = await dispatch(requestSignup({ username, password }))
      if (response.type === `${requestSignup.typePrefix}/fulfilled`) {
        const works = tagExamples.filter((_tag, idx) => tags[idx]).map(tag => dispatch(updateTag({ tag })))
        await Promise.all(works)
      }
    } else {
      const messageBuffer = []
      if (!flag1) messageBuffer.push(hint1)
      if (!flag1) messageBuffer.push(hint2)
      alert(messageBuffer.join('\n'))
    }
  }

  const handleTagsHandler = (idx: number) => {
    const newTags = [...tags]
    newTags[idx] = !newTags[idx]
    setTags(newTags)
  }

  return (
    <div className='signup-page'>
      <p />
      <h1>Signup to BookVillage</h1>
      <br />
      <br />
      <Form className='signup-input-class'>
        <InputGroup as={Row} className='signup'>
          <Form.Label>
            <h5>Username</h5>
            <p />
            <h5 id='cannot-change'>You cannot change your username after creating it.</h5>
            <Form.Control
              id='signup-username'
              type='text'
              placeholder='username'
              value={username}
              onChange={event => setUsername(event.target.value)}
              onMouseOver={event => { setHintShow1(true); setHintTarget1(event.currentTarget) }}
              onMouseOut={_event => { setHintShow1(false) }}
            />
            <Overlay
              show={hintShow1}
              target={hintTarget1}
              placement="right"
              container={null}
              containerPadding={0}
            >
              <Popover id="hint-username">
                <Popover.Header as="h3">Username</Popover.Header>
                <Popover.Body>
                  &middot; {hint1}<br />
                </Popover.Body>
              </Popover>
            </Overlay>
          </Form.Label>
        </InputGroup>
        <InputGroup as={Row} className='signup'>
          <Form.Label>
            <h5>Password</h5>
            <p />
            <Form.Control
              id='signup-password'
              type='password'
              value={password}
              placeholder='password'
              onChange={event => setPassword(event.target.value)}
              onMouseOver={event => { setHintShow2(true); setHintTarget2(event.currentTarget) }}
              onMouseOut={_event => { setHintShow2(false) }}
            />
            <Overlay
              show={hintShow2}
              target={hintTarget2}
              placement="right"
              container={null}
              containerPadding={0}
            >
              <Popover id="hint-password">
                <Popover.Header as="h3">Password</Popover.Header>
                <Popover.Body>
                  &middot; {hint2}<br />
                </Popover.Body>
              </Popover>
            </Overlay>
          </Form.Label>
        </InputGroup>
        <InputGroup as={Row} className='signup'>
          <Form.Label>
            <h5>Confirm Password</h5>
            <p />
            <Form.Control
              id='signup-confirm-password'
              type='password'
              value={confirmPassword}
              placeholder='password'
              onChange={event => setConfirmPassword(event.target.value)}
            />
          </Form.Label>
        </InputGroup>
      </Form>
      <br />
      <h3>Select Tags You Prefer!</h3>
      <div className='signup-tags'>
        {tagExamples.map((tag, idx) => (
          <Button
            variant="outline-primary"
            key={idx + 1}
            value={idx + 1}
            onClick={() => handleTagsHandler(idx)}
            className='tag-example'
            active={tags[idx]}
          >
            {tag}
          </Button>
        ))}
      </div>
      <br />
      <div className='signup-buttons'>
        <Button
          onClick={() => clickSubmitHandler()}
          id='signup-submit-button'
          variant='outline-success'
        >Submit</Button>
      </div>
    </div>
  )
}

export default SignupPage
