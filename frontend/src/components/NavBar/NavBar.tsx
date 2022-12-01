import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap'
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
          <Navbar.Offcanvas
            id='offcanvasNavbar-expand-lg'
            aria-labelledby='offcanvasNavbarLabel-expand-lg'
            placement='end'
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Offcanvas</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className='justify-content-end flex-grow-1 pe-3'>
                <Nav.Link className='offcanvas-button'><RegisterButton /></Nav.Link>
                <Nav.Link className='offcanvas-button'><ChattingButton /></Nav.Link>
                <Nav.Link className='offcanvas-button'><UserStatusButton /></Nav.Link>
                <Nav.Link className='offcanvas-button'><LogoutButton /></Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  )
}

export default NavBar
