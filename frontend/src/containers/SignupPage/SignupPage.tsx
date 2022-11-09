import { useState } from 'react'
import { Button, Form, InputGroup, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux'

import { AppDispatch } from '../../store'
import { requestSignup } from '../../store/slices/user/user'

import './SignupPage.css'

const SignupPage = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')

  const dispatch = useDispatch<AppDispatch>()

  const clickSubmitHandler = () => {
    if (password !== confirmPassword) {
      alert('Please check your password.')
      return
    }

    dispatch(requestSignup({ username, password }))
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
            Username
            <p/>
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
            Password
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
            Confirm Password
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
