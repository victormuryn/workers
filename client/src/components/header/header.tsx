import React, {useContext, useState} from 'react';
import {useSelector, shallowEqual} from 'react-redux';
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
  const history = useHistory();
  const {logout} = useContext(AuthContext);

  const [expanded, setExpanded] = useState<boolean>(false);

  const {user, users} = useSelector((state: State) => ({
    user: state.user,
    users: state.messages.users,
  }), shallowEqual);

  const isLogged = user.isAuthenticated;
  const unread = users.filter((user) => user.hasNewMessages).length;

  const onItemClick = () => {
    setTimeout(() => {
      setExpanded(false);
    }, 150);
  };

  const onLogoutClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    
    logout();
    onItemClick();
    history.push(`/`);
  };

  return (
    <Navbar
      bg="dark"
      expand="md"
      variant="dark"
      collapseOnSelect
      expanded={expanded}
    >
      <Container>
        <Navbar.Brand
          to="/"
          as={Link}
          onClick={onItemClick}
          className="inner-header__logo"
        >
          Workers
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => setExpanded((prev) => !prev)}
        />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto me-0">
            <Nav.Link
              onClick={onItemClick}
              as={NavLink}
              to="/projects"
              className="ms-2"
              activeClassName="active"
            >
              Проєкти
            </Nav.Link>

            {
              isLogged ?
                <>
                  <Nav.Link
                    onClick={onItemClick}
                    as={NavLink}
                    to="/messages"
                    className="ms-2"
                    activeClassName="active"
                  >
                    Повідомлення
                    {
                      unread !== 0 ?
                        <Badge variant="light" className="align-middle">
                          {unread}
                        </Badge> : undefined
                    }
                  </Nav.Link>
                  <NavDropdown
                    className="ms-2"
                    id="header-profile"
                    title={user.username}
                  >
                    <NavDropdown.Item
                      as={NavLink}
                      onClick={onItemClick}
                      activeClassName="active"
                      to={`/user/${user.username}`}
                    >
                      Профіль
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={NavLink}
                      onClick={onItemClick}
                      to="/activities"
                      activeClassName="active"
                    >
                      Мої {user.accountType === `client` ? `проєкти` : `ставки`}
                    </NavDropdown.Item>

                    <NavDropdown.Divider/>
                    <NavDropdown.Item onClick={onLogoutClick}>
                      Вийти
                    </NavDropdown.Item>
                  </NavDropdown>
                </> :
                <div className="d-flex justify-content-center mb-2">
                  <Button
                    as={Link}
                    to="/auth"
                    variant="success"
                    className="mx-2"
                    onClick={onItemClick}
                  >
                    Реєстрація
                  </Button>

                  <Button
                    as={Link}
                    to="/login"
                    variant="primary"
                    className="mx-2"
                    onClick={onItemClick}
                  >
                    Увійти
                  </Button>
                </div>
            }

            {/* if user is client => show 'create project' button */}
            {user.accountType === `client` && (
              <Button
                to="/create"
                variant="success"
                className="ms-md-5 my-2"
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
