import { useNavigate } from 'react-router'

const ChattingButton = () => {
  const navigate = useNavigate()

  return (
    <>
      <button
        type="button"
        onClick={() => navigate('/chat')}
      >Chat</button>
    </>
  )
}

export default ChattingButton
