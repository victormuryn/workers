import React from 'react';
import renderer from 'react-test-renderer';
import ProjectItem from './project-item';

describe(`ProjectItem tests`, () => {
  it(`ProjectItem renders corrects`, () => {
    const tree = renderer.create(<ProjectItem
      _id="111"
      title="Title"
      price={123}
      date="Wed Feb 17 2021 19:52:02 GMT+0200 (Eastern European Standard Time)"
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
