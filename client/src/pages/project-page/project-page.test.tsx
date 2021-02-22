import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import renderer from 'react-test-renderer';
import ProjectPage from './project-page';

describe(`ProjectPage tests`, () => {
  it(`ProjectPage renders corrects`, () => {
    const tree = renderer.create(<Router><ProjectPage /></Router>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
