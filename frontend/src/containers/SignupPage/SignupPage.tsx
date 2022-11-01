import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { AppDispatch } from '../../store'
import { requestSignup } from '../../store/slices/user/user'

const SignupPage = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')

  const dispatch = useDispatch<AppDispatch>()

  const clickSubmitHandler = async () => {
    if (password !== confirmPassword) {
      alert('Please check your password.')
      return
    }

    const data = { username, password }

    const response = await dispatch(requestSignup(data))

    if (response.type === `${requestSignup.typePrefix}/rejected`) {
      alert('Error on signup')
    }
  }

  return (
    <>
      <h1>SignupPage</h1>
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
      <label htmlFor="login-confirm-password">Confirm Password</label>
      <input
        id="login-confirm-password"
        // type="password" // TODO: add this property
        value={confirmPassword}
        onChange={event => setConfirmPassword(event.target.value)}
      />
      <br />
      <button onClick={() => clickSubmitHandler()}>Submit</button>
    </>
  )
}

export default SignupPage
