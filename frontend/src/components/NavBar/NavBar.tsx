import { useState } from 'react'
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap'
import ChattingButton from '../ChattingButton/ChattingButton'
import LogoButton from '../LogoButton/LogoButton'
import LogoutButton from '../LogoutButton/LogoutButton'
import RegisterButton from '../RegisterButton/RegisterButton'
import UserStatusButton from '../UserStatusButton/UserStatusButton'
import './NavBar.css'

const NavBar = () => {
  const [show, setShow] = useState<boolean>(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <Navbar bg='light' expand='lg' id='nav-bar'>
        <Container fluid>
          <Navbar.Brand><LogoButton /></Navbar.Brand>
          <Navbar.Toggle aria-controls={'offcanvasNavbar-expand-lg'} onClick={handleShow}/>
          <Navbar.Offcanvas
            id='offcanvasNavbar-expand-lg'
            aria-labelledby='offcanvasNavbarLabel-expand-lg'
            placement='end'
            show={show}
            onHide={handleClose}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className='justify-content-end flex-grow-1 pe-3'>
                <Nav.Link className='offcanvas-button' onClick={handleClose}><RegisterButton /></Nav.Link>
                <Nav.Link className='offcanvas-button' onClick={handleClose}><ChattingButton /></Nav.Link>
                <Nav.Link className='offcanvas-button' onClick={handleClose}><UserStatusButton /></Nav.Link>
                <Nav.Link className='offcanvas-button' onClick={handleClose}><LogoutButton /></Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  )
}

export default NavBar
