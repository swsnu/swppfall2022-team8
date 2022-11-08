import { useState } from 'react'
import { Button, Form, InputGroup, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'

import { AppDispatch } from '../../store'
import { requestLogin } from '../../store/slices/user/user'

import './LoginPage.css'

const LoginPage = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const clickLoginHandler = () => {
    const data = { username, password }
    dispatch(requestLogin(data))
  }

  return (
    <div className='login-page'>
      <p/>
      <h1>Sign in to BookVillage!</h1>
      <br />
      <br />
      <div>
        <Form className='signin-input-class'>
          <InputGroup as={Row} className='signin'>
            <Form.Label>
              Username
              <p/>
              <Form.Control
                id="login-username"
                type='text'
                placeholder='username'
                value={username}
                onChange={event => setUsername(event.target.value)}
              />
            </Form.Label>
          </InputGroup>
          <InputGroup as={Row} className='signin'>
            <Form.Label>
              Password
              <p/>
              <Form.Control
                id="login-password"
                type="password"
                value={password}
                placeholder='password'
                onChange={event => setPassword(event.target.value)}
              />
            </Form.Label>
          </InputGroup>
        </Form>
      </div>
      <br />
      <div className='signin-buttons'>
        <Button
          onClick={() => clickLoginHandler()}
          id='login-button'
          variant='outline-primary'
        >Login</Button>
        <Button
          onClick={() => navigate('/signup')}
          id='signup-button'
          variant='outline-success'
        >Sign up</Button>
      </div>
    </div>
  )
}

export default LoginPage
