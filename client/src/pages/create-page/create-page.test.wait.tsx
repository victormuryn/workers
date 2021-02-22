import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import renderer from 'react-test-renderer';
import CreatePage from './create-page';

describe(`CreatePage tests`, () => {
  it(`CreatePage renders corrects`, () => {
    const tree = renderer.create(<Router><CreatePage /></Router>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
