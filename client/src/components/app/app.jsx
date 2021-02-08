import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';

import {ScrollToTop} from '../scroll-to-top/scroll-to-top';

import './app.scss';


import {useAuth} from '../../../hooks/auth.hook';
import {useRoutes} from '../../../hooks/routes';
import AuthContext from '../../../context/Auth.context';

const App = () => {
  const {login, logout, token, userId, ready} = useAuth();
  const isAuthenticated = !!token;

  const router = useRoutes(isAuthenticated);

  if (!ready) {
    return (<div />);
  }

  return (
    <AuthContext.Provider value={{
      login,
      logout,
      token,
      userId,
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
