import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import renderer from 'react-test-renderer';

import ProjectItem from './project-item';

describe(`ProjectItem tests`, () => {
  it(`ProjectItem renders corrects`, () => {
    const tree = renderer.create(<Router>
      <ProjectItem
        title="Title"
        price={123}
        _id="111"
        hot={false}
        date={`Wed Feb 17 2021 19:52:02 GMT+0200
        (Eastern European Standard Time)`}
        location={{
          city: `Lviv`,
          region: `Lviv Oblast'`,
        }}
        category={[{
          _id: `test`,
          title: `test`,
        }]}
        remote
      >234234</ProjectItem>
    </Router>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
