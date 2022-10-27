import { useNavigate } from 'react-router'

const RegisterButton = () => {
  const navigate = useNavigate()

  return (
    <>
      <button
        type="button"
        onClick={() => navigate('/book/register')}
      >Register Book</button>
    </>
  )
}

export default RegisterButton
