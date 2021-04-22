import React from 'react';
import renderer from 'react-test-renderer';
import UserAvatar from './user-avatar';

describe(`UserAvatar tests`, () => {
  it(`UserAvatar renders corrects`, () => {
    const tree = renderer.create(<UserAvatar
      image={true}
      username="tester"
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
