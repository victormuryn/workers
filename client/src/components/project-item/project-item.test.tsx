import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import renderer from 'react-test-renderer';

import ProjectItem from './project-item';

describe(`ProjectItem tests`, () => {
  it(`ProjectItem renders corrects`, () => {
    const tree = renderer.create(<Router>
      <ProjectItem
        _id="111"
        title="Title"
        price={123}
        date={`Wed Feb 17 2021 19:52:02 GMT+0200
        (Eastern European Standard Time)`}
      />
    </Router>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
