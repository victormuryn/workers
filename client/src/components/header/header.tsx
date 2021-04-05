import React, {useContext} from 'react';
import {useSelector} from 'react-redux';
import {Link, NavLink, useHistory} from 'react-router-dom';

import {State} from '../../redux/reducer';
import AuthContext from '../../context/Auth.context';

import './header.scss';

import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Header: React.FC = () => {
  const {logout} = useContext(AuthContext);
  const {user, unread} = useSelector((state: State) => (
    {
      user: state.user,
      unread: state.messages.unread,
    }
  ));
  const history = useHistory();

  const isLogged = user.isAuthenticated;

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

            {
              isLogged ?
                <>
                  <Nav.Link
                    as={NavLink} activeClassName="active"
                    to="/messages"
                    className="ms-2"
                  >
                    Повідомлення
                    {
                      unread.length !== 0 ?
                        <Badge variant="light" className="align-middle">
                          {unread.length}
                        </Badge> : undefined
                    }
                  </Nav.Link>
                  <NavDropdown
                    className="ms-2"
                    title={user.username}
                    id="header-profile"
                  >
                    <NavDropdown.Item as={Link} to={`/user/${user.username}`}>
                      Профіль
                    </NavDropdown.Item>

                    <NavDropdown.Divider/>
                    <NavDropdown.Item onClick={onLogoutClick}>
                      Вийти
                    </NavDropdown.Item>
                  </NavDropdown>
                </> :
                <>
                  <Button
                    as={Link}
                    to="/auth"
                    variant="success"
                    className="mx-2"
                  >
                    Реєстрація
                  </Button>

                  <Button
                    as={Link}
                    to="/login"
                    variant="primary"
                    className="mx-2"
                  >
                    Увійти
                  </Button>
                </>
            }

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
