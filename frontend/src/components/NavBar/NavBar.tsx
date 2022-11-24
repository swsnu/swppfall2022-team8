import { Container, Nav, Navbar } from 'react-bootstrap'
import ChattingButton from '../ChattingButton/ChattingButton'
import LogoButton from '../LogoButton/LogoButton'
import LogoutButton from '../LogoutButton/LogoutButton'
import RegisterButton from '../RegisterButton/RegisterButton'
import UserStatusButton from '../UserStatusButton/UserStatusButton'
import './NavBar.css'

const NavBar = () => {
  return (
    <>
      <Navbar bg='light' expand='lg' id='nav-bar'>
        <Container fluid>
          <Navbar.Brand><LogoButton /></Navbar.Brand>
          <Navbar.Toggle aria-controls={'offcanvasNavbar-expand-lg'} />
          <Nav>
            <Nav.Link><RegisterButton /></Nav.Link>
            <Nav.Link><ChattingButton /></Nav.Link>
            <Nav.Link><UserStatusButton /></Nav.Link>
            <Nav.Link><LogoutButton /></Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}

export default NavBar
