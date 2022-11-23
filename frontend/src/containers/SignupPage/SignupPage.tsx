import { useState } from 'react'
import { Button, Form, InputGroup, Row } from 'react-bootstrap'
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

    const response = await dispatch(requestSignup({ username, password }))
    if (response.type === `${requestSignup.typePrefix}/fulfilled`) {
      const works = tagExamples.filter((_tag, idx) => tags[idx]).map(tag => dispatch(updateTag({ tag })))
      await Promise.all(works)
    }
  }

  const handleTagsHandler = (idx: number) => {
    const newTags = [...tags]
    newTags[idx] = !newTags[idx]
    setTags(newTags)
  }

  return (
    <div className='signup-page'>
      <p/>
      <h1>Signup to BookVillage</h1>
      <br />
      <br />
      <Form className='signup-input-class'>
        <InputGroup as={Row} className='signup'>
          <Form.Label>
            <h5>Username</h5>
            <p/>
            <h5 id='cannot-change'>You cannot change your username after creating it.</h5>
            <Form.Control
              id='signup-username'
              type='text'
              placeholder='username'
              value={username}
              onChange={event => setUsername(event.target.value)}
            />
          </Form.Label>
        </InputGroup>
        <InputGroup as={Row} className='signup'>
          <Form.Label>
            <h5>Password</h5>
            <p/>
            <Form.Control
              id='signup-password'
              type='password'
              value={password}
              placeholder='password'
              onChange={event => setPassword(event.target.value)}
            />
          </Form.Label>
        </InputGroup>
        <InputGroup as={Row} className='signup'>
          <Form.Label>
            <h5>Confirm Password</h5>
            <p/>
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
      <br/>
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
      <br/>
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
