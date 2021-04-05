import React from 'react';
import renderer from 'react-test-renderer';
import ProjectContent from './project-content';

describe(`ProjectContent tests`, () => {
  it(`ProjectContent renders corrects`, () => {
    const tree = renderer.create(<ProjectContent
      hot={false}
      price={100}
      title="title"
      description="text"
      isExpired={false}
      location={{
        city: ``,
        region: ``,
        latitude: 432.32,
        longitude: 12.332,
      }}
      category={{
        title: `test`,
        url: `test`,
      }}
      remote
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
