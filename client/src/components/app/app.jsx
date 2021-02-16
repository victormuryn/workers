import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import {ScrollToTop} from '../scroll-to-top/scroll-to-top';

import 'bootstrap/dist/css/bootstrap.min.css';
import './app.scss';

import {useAuth} from '../../hooks/auth.hook';
import {useRoutes} from '../../hooks/routes';
import AuthContext from '../../context/Auth.context';

const App = () => {
  const dispatch = useDispatch();
  const {isAuthenticated, accountType} = useSelector((state) => state.user);

  const {login, logout, ready} = useAuth(dispatch);

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
