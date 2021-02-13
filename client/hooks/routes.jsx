import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import MainPage from '../src/pages/main-page/main-page';
import AuthPage from '../src/pages/auth-page/auth-page';
import LoginPage from '../src/pages/login-page/login-page';
import ProjectsPage from '../src/pages/projects-page/projects-page';
import CreatePage from '../src/pages/create-page/create-page';

import Header from '../src/components/header/header';
import Footer from '../src/components/footer/footer';

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <>
        <Header />

        <Switch>
          <Route path="/my" exact>
            <ProjectsPage />
          </Route>

          <Route path="/create" exact>
            <CreatePage />
          </Route>

          <Route>
            <Redirect to="/my" />
          </Route>
        </Switch>

        <Footer />
      </>
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

      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
};
