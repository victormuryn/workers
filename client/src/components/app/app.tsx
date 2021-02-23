import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';

import ScrollToTop from '../scroll-to-top';

import 'bootstrap/dist/css/bootstrap.min.css';
import './app.scss';

import {useDispatch, useSelector} from 'react-redux';
import {useAuth} from '../../hooks/auth.hook';
import {useRoutes} from '../../hooks/routes';
import AuthContext from '../../context/Auth.context';

import {State} from '../../redux/reducer';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const {login, logout, ready} = useAuth(dispatch);

  const user = useSelector((state: State) => state.user);
  const {isAuthenticated, accountType} = user;

  const router = useRoutes(isAuthenticated, accountType);
  if (!ready) {
    return (<div />);
  }

  return (
    <AuthContext.Provider value={{
      login,
      logout,
      isAuthenticated,
    }}>
      <Router>
        <ScrollToTop />
        {router}
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
