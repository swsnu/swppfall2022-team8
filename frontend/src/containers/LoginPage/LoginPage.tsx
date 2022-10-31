import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'

import { AppDispatch } from '../../store'
import { requestLogin } from '../../store/slices/user/user'

const LoginPage = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const clickLoginHandler = async () => {
    const data = { username, password }

    const response = await dispatch(requestLogin(data))

    if (response.type === `${requestLogin.typePrefix}/fulfilled`) {
      navigate('/main')
    } else {
      alert('Username or Password is wrong')
    }
  }

  return (
    <>
      <h1>LoginPage</h1>
      <label htmlFor="login-username">Username</label>
      <input
        id="login-username"
        type="text"
        value={username}
        onChange={event => setUsername(event.target.value)}
      />
      <br />
      <label htmlFor="login-password">Password</label>
      <input
        id="login-password"
        // type="password" // TODO: add this property
        value={password}
        onChange={event => setPassword(event.target.value)}
      />
      <br />
      <button onClick={() => clickLoginHandler()}>Login</button>
      <button onClick={() => navigate('/signup')}>Sign up</button>
    </>
  )
}

export default LoginPage
