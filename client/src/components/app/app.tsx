import React, {useEffect} from 'react';
import {BrowserRouter as Router, Link} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './app.scss';

import {useDispatch, useSelector} from 'react-redux';
import {useAuth} from '../../hooks/auth.hook';
import {useRoutes} from '../../hooks/routes';
import AuthContext from '../../context/Auth.context';
import {ActionCreator} from '../../redux/action-creator';

import Toast from 'react-bootstrap/Toast';

import Loader from '../loader';
import ScrollToTop from '../scroll-to-top';
import {State} from '../../redux/reducer';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const {login, logout, ready} = useAuth(dispatch);

  const {user, unread} = useSelector((state: State) => ({
    user: state.user,
    unread: state.messages.unread,
  }));
  const {isAuthenticated, accountType} = user;

  const messages = unread.map(({message, from}, i) => (
    <Toast key={from + i} className="my-2" autohide>
      <Toast.Header closeLabel="Закрити">
        <Link
          to={`/user/${from}`}
          className="me-auto text-decoration-none text-dark"
        >
          <img
            alt={from}
            width={20}
            className="rounded-circle me-2"
            src={`http://localhost:8080/img/users/${from}.webp`}
          />
          <strong>{from}</strong>
        </Link>

        <small className="me-1">just now</small>
      </Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  ));

  useEffect(() => {
    return () => {
      dispatch(ActionCreator.offSocket());
    };
  }, []);

  const router = useRoutes(isAuthenticated, accountType);
  if (!ready) {
    return (<Loader />);
  }

  return (
    <AuthContext.Provider value={{
      login,
      logout,
      isAuthenticated,
    }}>
      <Router>
        <ScrollToTop />

        <div style={{position: `fixed`, bottom: 50, right: 15, zIndex: 99}}>
          {messages}
        </div>

        {router}
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
