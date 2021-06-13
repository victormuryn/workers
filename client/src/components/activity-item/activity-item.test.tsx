import React from 'react';
import renderer from 'react-test-renderer';
import ActivityItem from './activity-item';

describe(`ActivityItem tests`, () => {
  it(`ActivityItem renders corrects`, () => {
    const tree = renderer.create(<ActivityItem
      hot
      id="test"
      title="testTitle"
      category={[]}
      remote
      location={{city: ``, region: ``}}
      date={new Date()}
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
