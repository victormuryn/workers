import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import renderer from 'react-test-renderer';
import LoginPage from './login-page';

describe(`LoginPage tests`, () => {
  it(`LoginPage renders corrects`, () => {
    const tree = renderer.create(<Router><LoginPage /></Router>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
