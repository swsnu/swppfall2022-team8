import { useState } from 'react'
import { Button, Form, InputGroup, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import AlertModal from '../../components/AlertModal/AlertModal'

import { AppDispatch } from '../../store'
import { errorPrefix, requestLogin } from '../../store/slices/user/user'

import './LoginPage.css'

const LoginPage = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [show, setShow] = useState<boolean>(false)
  const [header, setHeader] = useState<string>('')
  const [body, setBody] = useState<string | JSX.Element>('')

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const disableLogin = !(username && password)

  const clickLoginHandler = async () => {
    const data = { username, password }
    const response = await dispatch(requestLogin(data))
    if (response.type === `${requestLogin.typePrefix}/rejected`) {
      const errorResponse = response as { error: { message: string } }
      if (errorResponse.error.message === errorPrefix(403)) {
        setHeader('Authentication error')
        setBody('Username or Password is wrong')
        setShow(true)
      } else {
        alert('Error on login')
      }
    }
  }

  return (
    <div className='page' id='login-grid'>
      <div className='blank'></div>
      <div></div>
      <div></div>
      <div></div>
      <div className='login-page'>
        <p />
        <h1>Sign in to BookVillage!</h1>
        <br />
        <br />
        <div>
          <Form className='signin-input-class'>
            <InputGroup as={Row} className='signin'>
              <Form.Label>
                Username
                <p />
                <Form.Control
                  id="login-username"
                  type='text'
                  autoComplete='off'
                  placeholder='username'
                  value={username}
                  onChange={event => setUsername(event.target.value)}
                  onKeyPress={event => { if (event.key === 'Enter' && !disableLogin) { event.preventDefault(); clickLoginHandler() } }}
                />
              </Form.Label>
            </InputGroup>
            <InputGroup as={Row} className='signin'>
              <Form.Label>
                Password
                <p />
                <Form.Control
                  id="login-password"
                  type="password"
                  autoComplete='off'
                  value={password}
                  placeholder='password'
                  onChange={event => setPassword(event.target.value)}
                  onKeyPress={event => { if (event.key === 'Enter' && !disableLogin) { event.preventDefault(); clickLoginHandler() } }}
                />
              </Form.Label>
            </InputGroup>
          </Form>
        </div>
        <br />
        <div className='signin-buttons'>
          <Button
            disabled={disableLogin}
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
      <div></div>
      <div className='blank'></div>
      <div className='blank'></div>
      <div className='blank'></div>
      <AlertModal
        header={header}
        body={body}
        show={show}
        hide={() => setShow(false)}
      />
    </div>
  )
}

export default LoginPage
