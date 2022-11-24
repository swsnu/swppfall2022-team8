import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import { selectUser } from '../../store/slices/user/user'
import Footer from '../Footer/Footer'

interface IProps {
  auth: boolean
  element: JSX.Element
}

const AuthElement = (props: IProps) => {
  const userState = useSelector(selectUser)

  return (
    <>
      {props.auth
        ? (userState.currentUser ? <>{props.element} <Footer /></> : <Navigate to="/login" replace />)
        : (userState.currentUser ? <Navigate to="/main" replace /> : props.element)
      }
    </>
  )
}

export default AuthElement
