import React, {useContext} from 'react';
import {useSelector} from 'react-redux';
import {Link, NavLink, useHistory} from 'react-router-dom';

import {State} from '../../redux/reducer';
import AuthContext from '../../context/Auth.context';

import './header.scss';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Header: React.FC = () => {
  const {logout} = useContext(AuthContext);
  const user = useSelector((state: State) => state.user);
  const history = useHistory();

  const onLogoutClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    logout();
    history.push(`/`);
  };

  return (
    <Navbar bg="dark" variant="dark" collapseOnSelect expand="md">
      <Container>
        <Navbar.Brand as={Link} to="/" className="inner-header__logo">
          Workers
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto me-0">
            <Nav.Link
              as={NavLink} activeClassName="active"
              to="/projects"
              className="ms-2"
            >
              Проєкти
            </Nav.Link>

            <Nav.Link className="ms-2" href="#features">Features</Nav.Link>

            <NavDropdown
              className="ms-2"
              title={user.username}
              id="header-profile"
            >
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider/>
              <NavDropdown.Item onClick={onLogoutClick}>Вийти</NavDropdown.Item>
            </NavDropdown>

            {/* if user is client => show 'create project' button */}
            {user.accountType === `client` && (
              <Button
                to="/create"
                variant="success"
                className="ms-md-5"
                as={Link}
              >
                Створити проєкт
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
