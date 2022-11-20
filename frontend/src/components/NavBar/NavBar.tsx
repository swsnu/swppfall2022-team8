import { Container, Navbar } from 'react-bootstrap'
import LogoButton from '../LogoButton/LogoButton'
import './NavBar.css'

const NavBar = () => {
  return (
    <>
      <Navbar bg='light' expand='lg' id='nav-bar'>
        <Container fluid>
          <Navbar.Brand><LogoButton /></Navbar.Brand>
          <Navbar.Toggle aria-controls={'offcanvasNavbar-expand-lg'} />
        </Container>
      </Navbar>
    </>
  )
}

export default NavBar
