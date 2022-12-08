import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import { selectUser } from '../../store/slices/user/user'
import Footer from '../Footer/Footer'
import NavBar from '../NavBar/NavBar'

interface IProps {
  auth: boolean
  element: JSX.Element
}

const AuthElement = (props: IProps) => {
  const userState = useSelector(selectUser)

  return (
    <>
      {props.auth
        ? (userState.currentUser ? <><NavBar />{props.element} <Footer /></> : <Navigate to="/login" replace />)
        : (userState.currentUser ? <Navigate to="/main" replace /> : props.element)
      }
    </>
  )
}

export default AuthElement
