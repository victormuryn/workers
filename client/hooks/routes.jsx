import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import MainPage from '../src/components/main-page/main-page';
import AuthPage from '../src/components/auth-page/auth-page';
import LoginPage from '../src/components/login-page/login-page';

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/" exact>
          Main
        </Route>

        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" exact>
        <MainPage />
      </Route>

      <Route path="/auth" exact>
        <AuthPage />
      </Route>

      <Route path="/login" exact>
        <LoginPage />
      </Route>

      <Redirect to="/" />
    </Switch>
  );
};
