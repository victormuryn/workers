import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import MainPage from '../pages/main-page';
import AuthPage from '../pages/auth-page';
import LoginPage from '../pages/login-page';
import ProjectsPage from '../pages/projects-page';
import ProjectPage from '../pages/project-page';
import CreatePage from '../pages/create-page';

import Header from '../components/header';
import Footer from '../components/footer';

import {AccountTypes} from '../types/types';

export const useRoutes = (
  isAuthenticated: boolean,
  accountType: AccountTypes | null,
): JSX.Element => {
  if (isAuthenticated) {
    if (accountType === `client`) {
      return (
        <>
          <Header/>
          <Switch>
            {/* <Route path="/" exact component={ProjectsPage} />*/}
            <Route path="/create" exact component={CreatePage} />

            <Route path="/projects" exact component={ProjectsPage} />
            <Route path="/project/:id" component={ProjectPage} />

            <Route>
              <Redirect to="/"/>
            </Route>
          </Switch>
          <Footer/>
        </>
      );
    }

    if (accountType === `freelancer`) {
      return (
        <>
          <Header/>
          <Switch>
            {/* <Route path="/" exact component={ProjectsPage} />*/}

            <Route path="/projects" exact component={ProjectsPage} />
            <Route path="/project/:id" component={ProjectPage} />

            <Route>
              <Redirect to="/" />
            </Route>
          </Switch>
          <Footer/>
        </>
      );
    }
  }

  return (
    <Switch>
      <Route path="/" exact component={MainPage} />

      <Route path="/auth" exact component={AuthPage} />
      <Route path="/login" exact component={LoginPage} />

      <Route path="/projects" exact component={ProjectsPage} />
      <Route path="/project/:id" component={ProjectPage} />

      <Route>
        <Redirect to="/"/>
      </Route>
    </Switch>
  );
};
