import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import MainPage from '../pages/main-page';
import AuthPage from '../pages/auth-page';
import UserPage from '../pages/user-page';
import LoginPage from '../pages/login-page';
import CreatePage from '../pages/create-page';
import ProjectPage from '../pages/project-page';
import ProjectsPage from '../pages/projects-page';
import CategoryPage from '../pages/category-page';
import ActivitiesPage from '../pages/activities-page';

import Header from '../components/header';
import Footer from '../components/footer';

import {AccountTypes} from '../types/types';
import ChatPage from '../pages/chat-page';

export const useRoutes = (
  isAuthenticated: boolean,
  accountType: AccountTypes | null,
) => {
  if (isAuthenticated) {
    return (
      <>
        <Header/>
        <Switch>
          <Route path="/projects" component={ProjectsPage} exact />
          <Route path="/project/:id" component={ProjectPage} />

          <Route path="/category/:name" component={CategoryPage} />

          <Route path="/user/:username" component={UserPage} />
          <Route path="/activities" component={ActivitiesPage} exact />

          <Route path="/messages/" component={ChatPage} />

          {
            accountType === `client` && (
              <Route path="/create" component={CreatePage} exact />
            )
          }

          <Redirect to="/projects" />
        </Switch>
        <Footer/>
      </>
    );
  }

  return (
    <Switch>
      <Route path="/" component={MainPage} exact />

      <Route path="/auth" component={AuthPage} exact />
      <Route path="/login" component={LoginPage} exact />

      <Route>
        <Header />

        <Switch>
          <Route path="/projects" component={ProjectsPage} exact />
          <Route path="/project/:id" component={ProjectPage} />

          <Route path="/category/:name" component={CategoryPage} />

          <Route path="/user/:username" component={UserPage} />

          <Redirect to="/" />
        </Switch>

        <Footer />
      </Route>
    </Switch>
  );
};
