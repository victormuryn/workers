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
          <Route path="/projects" exact component={ProjectsPage} />
          <Route path="/project/:id" component={ProjectPage} />

          <Route path="/category/:name" component={CategoryPage} />

          <Route path="/user/:username" component={UserPage} />

          <Route path="/messages/" component={ChatPage} />

          {
            accountType === `client` && (
              <Route path="/create" exact component={CreatePage} />
            )
          }

          <Route>
            <Redirect to="/projects" />
          </Route>
        </Switch>
        <Footer/>
      </>
    );
  }

  return (
    <Switch>
      <Route path="/" exact component={MainPage} />

      <Route path="/auth" exact component={AuthPage} />
      <Route path="/login" exact component={LoginPage} />

      <Route>
        <Header />
        <Route path="/projects" exact component={ProjectsPage} />
        <Route path="/project/:id" component={ProjectPage} />

        <Route path="/category/:name" component={CategoryPage} />

        <Route path="/user/:username" component={UserPage} />
        <Footer />
      </Route>

      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
};
