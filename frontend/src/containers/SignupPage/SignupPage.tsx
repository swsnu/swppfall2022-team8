import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { AppDispatch } from '../../store'
import { requestSignup } from '../../store/slices/user/user'

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
    <>
      <h1>SignupPage</h1>
      <br />
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
        type="password"
        value={password}
        onChange={event => setPassword(event.target.value)}
      />
      <br />
      <label htmlFor="login-confirm-password">Confirm Password</label>
      <input
        id="login-confirm-password"
        type="password"
        value={confirmPassword}
        onChange={event => setConfirmPassword(event.target.value)}
      />
      <br />
      <button onClick={() => clickSubmitHandler()}>Submit</button>
    </>
  )
}

export default SignupPage
