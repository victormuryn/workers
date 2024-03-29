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
        bets={[]}
        hot={false}
        date={`Wed Feb 17 2021 19:52:02 GMT+0200
        (Eastern European Standard Time)`}
        location={{
          city: `Lviv`,
          region: `Lviv Oblast'`,
          latitude: 3.23,
          longitude: 3214,
        }}
        category={[{
          _id: `test`,
          title: `test`,
          url: `test`,
        }]}
        remote
      />
    </Router>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
