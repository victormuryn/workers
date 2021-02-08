import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import './app.scss';

import MainPage from '../main-page/main-page';
import AuthPage from '../auth-page/auth-page';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <MainPage />
        </Route>

        <Route path="/auth" exact>
          <AuthPage />
        </Route>
      </Switch>
    </Router>
  );
};


export default App;
