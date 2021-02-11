import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import renderer from 'react-test-renderer';
import AuthPage from './auth-page';

describe(`AuthPage tests`, () => {
  it(`AuthPage renders corrects`, () => {
    const tree = renderer.create(<Router><AuthPage /></Router>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
