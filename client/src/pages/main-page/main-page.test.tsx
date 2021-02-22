import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import renderer from 'react-test-renderer';
import MainPage from './main-page';

describe(`MainPage tests`, () => {
  it(`MainPage renders corrects`, () => {
    const tree = renderer.create(<Router><MainPage /></Router>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
