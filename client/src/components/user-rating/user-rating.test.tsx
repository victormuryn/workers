import React from 'react';
import renderer from 'react-test-renderer';
import UserRating from './user-rating';

describe(`UserRating tests`, () => {
  it(`UserRating renders corrects`, () => {
    const tree = renderer.create(<UserRating
      isOwner={false}
      categories={[{
        all: 32,
        place: 11,
        title: 'test',
        url: 'test',
        id: '23dg23f',
      }]}
      rating={{
        all: 32,
        place: 23,
      }}
      onCategoryChange={() => {}}
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
