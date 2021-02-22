import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import renderer from 'react-test-renderer';
import ProjectsPage from './projects-page';

describe(`ProjectsPage tests`, () => {
  it(`ProjectsPage renders corrects`, () => {
    const tree = renderer.create(<Router><ProjectsPage /></Router>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
