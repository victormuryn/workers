import React, {useContext} from 'react';

import {Link, useHistory} from 'react-router-dom';
import AuthContext from '../../../context/Auth.context';

import './header.scss';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';


const Header = () => {
  const {logout} = useContext(AuthContext);
  const history = useHistory();

  const onLogoutClick = (event) => {
    event.preventDefault();
    logout();
    history.push(`/`);
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Link to="/" className="inner-header__logo">
          <Navbar.Brand>
            Workers
          </Navbar.Brand>
        </Link>

        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Features</Nav.Link>

          <NavDropdown title="Профіль" id="header-profile">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={onLogoutClick}>Вийти</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
