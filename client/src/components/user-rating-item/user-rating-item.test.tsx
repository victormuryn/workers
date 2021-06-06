import React from 'react';
import renderer from 'react-test-renderer';
import UserRatingItem from './user-rating-item';

describe(`UserRatingItem tests`, () => {
  it(`UserRatingItem renders corrects`, () => {
    const tree = renderer.create(<UserRatingItem
      id="2"
      all={12}
      place={3}
      url="test"
      title="Test title"
      isOwner={false}
      onCategoryChange={() => {}}
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
