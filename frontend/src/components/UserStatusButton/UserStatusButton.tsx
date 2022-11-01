import { useNavigate } from 'react-router'

const UserStatusButton = () => {
  const navigate = useNavigate()

  return (
    <>
      <button
        type="button"
        onClick={() => navigate('/status')}
      >User Status</button>
    </>
  )
}

export default UserStatusButton
