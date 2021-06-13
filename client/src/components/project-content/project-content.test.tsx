import React from 'react';
import renderer from 'react-test-renderer';
import ProjectContent from './project-content';

describe(`ProjectContent tests`, () => {
  it(`ProjectContent renders corrects`, () => {
    const tree = renderer.create(<ProjectContent
      isOwner={true}
      hot={false}
      price={100}
      title="title"
      onDelete={() => {}}
      description="text"
      isExpired={false}
      updated={{
        count: 0,
        lastDate: `123`,
      }}
      onProjectChange={() => {}}
      location={{
        city: ``,
        region: ``,
        latitude: 432.32,
        longitude: 12.332,
      }}
      category={[{
        _id: `test`,
        title: `test`,
        url: `test`,
      }]}
      remote
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
