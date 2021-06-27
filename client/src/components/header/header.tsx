import React, {useContext, useState} from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {Link, NavLink, useHistory} from 'react-router-dom';

import {State} from '../../redux/reducer';
import AuthContext from '../../context/Auth.context';

import UserAvatar from '../user-avatar';
import Dropdown from '../dropdown';
import Button from '../button';
import Badge from '../badge';

import './header.css';

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

  const onItemClick = () => setExpanded(false);

  const onLogoutClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    logout();
    onItemClick();
    history.push(`/`);
  };

  return (
    <nav className={`nav ${expanded && `nav--open`}`}>
      <div className="container nav__container">
        {
          isLogged &&
            <button
              className="nav__toggle"
              onClick={() => setExpanded((prev) => !prev)}
            >
              <span className="nav__toggle-bar nav__toggle-bar--1"/>
              <span className="nav__toggle-bar nav__toggle-bar--2"/>
              <span className="nav__toggle-bar nav__toggle-bar--3"/>
              <span className="visually-hidden">Відкрити меню</span>
            </button>
        }

        <Link
          to="/"
          className="nav__logo"
          onClick={onItemClick}
        >
          <img src="/img/logo.svg" alt="Workers" width="134" height="30"/>
        </Link>

        {
          isLogged &&
          <ul className="nav__list">
            <li className="nav__list-item">
              <NavLink
                to="/dashboard"
                activeClassName="active"
                className="nav__list-link"
                onClick={onItemClick}
              >
                Консоль
              </NavLink>
            </li>

            <li className="nav__list-item">
              <NavLink
                to="/projects"
                activeClassName="active"
                className="nav__list-link"
                onClick={onItemClick}
              >
                Проєкти
              </NavLink>
            </li>

            <li className="nav__list-item">
              <NavLink
                to="/messages"
                className="nav__list-link"
                activeClassName="active"
                onClick={onItemClick}
              >
                Повідомлення
                {
                  unread !== 0 ?
                    <> <Badge variant="primary">{unread}</Badge></>:
                    null
                }
              </NavLink>
            </li>

            {
              user.accountType === `client` &&
                <li className="nav__list-item--mobile">
                  <Button
                    as={Link}
                    to="/create"
                    variant="success"
                    className="nav__create-btn-nav"
                  >Створити проєкт</Button>
                </li>
            }
          </ul>
        }

        <div className="nav__right">
          {
            isLogged ?
              <>
                <button className="nav__bell-button">
                  <img src="/img/bell.svg" alt=""/>
                </button>

                <Dropdown
                  title={
                    <UserAvatar
                      width={32}
                      alt={user.username}
                      buffer={user.image.buffer}
                      extension={user.image.extension}
                    />
                  }>

                  <Dropdown.Item to={`/user/${user.username}`}>
                    Профіль
                  </Dropdown.Item>
                  <Dropdown.Item to="/activities">Моя діяльність</Dropdown.Item>
                  <Dropdown.Item>Налаштування</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={onLogoutClick}>Вийти</Dropdown.Item>
                </Dropdown>

                {
                  user.accountType === `client` &&
                    <Button
                      as={Link}
                      to="/create"
                      variant="success"
                      className="nav__create-btn"
                    >Створити проєкт</Button>
                }
              </> :
              <>
                <Button
                  as={Link}
                  to="/auth"
                  variant="success"
                  className="nav__auth-btn"
                >Реєстрація</Button>

                <Button
                  as={Link}
                  to="/login"
                  variant="primary"
                  className="nav__auth-btn"
                >Увійти</Button>
              </>
          }
        </div>
      </div>
    </nav>
  );
};

export default Header;

// <Navbar
//   bg="dark"
//   expand="md"
//   variant="dark"
//   collapseOnSelect
//   expanded={expanded}
// >
//   <Container>
//     <Navbar.Brand
//       to="/"
//       as={Link}
//       onClick={onItemClick}
//       className="inner-header__logo"
//     >
//       Workers
//     </Navbar.Brand>
//
//     <Navbar.Toggle
//       aria-controls="responsive-navbar-nav"
//       onClick={() => setExpanded((prev) => !prev)}
//     />
//
//     <Navbar.Collapse id="responsive-navbar-nav">
//       <Nav className="ms-auto me-0 align-items-md-center">
//         <Nav.Link
//           onClick={onItemClick}
//           as={NavLink}
//           to="/projects"
//           className="ms-2"
//           activeClassName="active">
//           Проєкти
//         </Nav.Link>
//
//         {
//           isLogged ?
//             <>
//               <Nav.Link
//                 onClick={onItemClick}
//                 as={NavLink}
//                 to="/messages"
//                 className="ms-2"
//                 activeClassName="active">
//                 Повідомлення
//                 {
//                   unread !== 0 ?
//                     <Badge variant="light" className="align-middle">
//                       {unread}
//                     </Badge> :
//                     undefined
//                 }
//               </Nav.Link>
//               <NavDropdown
//                 className="ms-2"
//                 id="header-profile"
//                 title={user.username}
//               >
//                 <NavDropdown.Item
//                   as={NavLink}
//                   onClick={onItemClick}
//                   activeClassName="active"
//                   to={`/user/${user.username}`}>
//                   Профіль
//                 </NavDropdown.Item>
//
//                 <NavDropdown.Item
//                   as={NavLink}
//                   onClick={onItemClick}
//                   to="/activities"
//                   activeClassName="active">
//                   Мої {user.accountType === `client` ? `проєкти` : `ставки`}
//                 </NavDropdown.Item>
//
//                 <NavDropdown.Divider/>
//                 <NavDropdown.Item onClick={onLogoutClick}>
//                   Вийти
//                 </NavDropdown.Item>
//               </NavDropdown>
//             </> :
//             <div className="d-flex justify-content-center mb-2">
//               <Button
//                 as={Link}
//                 to="/auth"
//                 variant="success"
//                 className="mx-2"
//                 onClick={onItemClick}
//               >
//                 Реєстрація
//               </Button>
//
//               <Button
//                 as={Link}
//                 to="/login"
//                 variant="primary"
//                 className="mx-2"
//                 onClick={onItemClick}
//               >
//                 Увійти
//               </Button>
//             </div>
//         }
//
//         {/* if user is client => show 'create project' button */}
//         {
//           user.accountType === `client` &&
//           <Button
//             as={Link}
//             to="/create"
//             variant="success"
//             className="ms-md-5 my-2 my-md-1"
//           >
//             Створити проєкт
//           </Button>
//         }
//       </Nav>
//     </Navbar.Collapse>
//   </Container>
// </Navbar>
