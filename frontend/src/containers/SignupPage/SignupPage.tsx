import { useState } from 'react'
import { Button, Form, InputGroup, Overlay, Popover, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import AlertModal from '../../components/AlertModal/AlertModal'

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

  const [show, setShow] = useState<boolean>(false)
  const [header, setHeader] = useState<string>('')
  const [body, setBody] = useState<string>('')

  const dispatch = useDispatch<AppDispatch>()

  const usernameHint = ['Username should be at least 6 alphabets, numbers, dashes (-), and underscores (_)']
  const passwordHint = [
    'Password should contain at least 8 alphabets, numbers, and special characters',
    'At least one of the above items should be included',
    '(special character: `~!@#$%&*_^-)'
  ]

  const alertHints = [
    usernameHint[0],
    passwordHint[0] + ', each containing at least one.\n' + passwordHint[2]
  ]
  const regexes = [
    /^[a-zA-Z0-9_-]{6,}$/,
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~!@#$%&*_^-])[A-Za-z\d`~!@#$%&*_^-]{8,}$/
  ]

  const clickSubmitHandler = async () => {
    if (password !== confirmPassword) {
      setHeader('Form validation error')
      setBody('The password and confirm password are not the same.')
      setShow(true)
      return
    }

    if (tags.every(val => !val)) {
      setHeader('Form validation error')
      setBody('Please select at least one tag.')
      setShow(true)
      return
    }

    const entries = [username, password]
    const tests = entries.map((entry, idx) => regexes[idx].test(entry))

    if (tests.every(val => val)) {
      const response = await dispatch(requestSignup({ username, password }))
      if (response.type === `${requestSignup.typePrefix}/fulfilled`) {
        const works = tagExamples.filter((_tag, idx) => tags[idx]).map(tag => dispatch(updateTag({ tag })))
        await Promise.all(works)
      }
    } else {
      const messageBuffer: string[] = []
      tests.forEach((test, idx) => {
        if (!test) messageBuffer.push(alertHints[idx])
      })
      setHeader('Form validation error')
      setBody(messageBuffer.join('\n'))
      setShow(true)
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
              autoComplete='off'
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
                  &middot; {usernameHint[0]}
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
                  &middot; {passwordHint[0]}<br />
                  &middot; {passwordHint[1]}<br /><br />
                  {passwordHint[2]}
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
      <AlertModal
        header={header}
        body={body}
        show={show}
        hide={() => setShow(false)}
      />
    </div>
  )
}

export default SignupPage
