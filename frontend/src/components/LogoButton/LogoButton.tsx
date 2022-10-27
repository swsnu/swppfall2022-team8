import { useNavigate } from 'react-router'

const LogoButton = () => {
  const navigate = useNavigate()

  return (
    <>
      <button
        type="button"
        onClick={() => navigate('/main')}
      >LOGO</button>
    </>
  )
}

export default LogoButton
