import React from 'react';
import renderer from 'react-test-renderer';
import UserAvatar from './user-avatar';

describe(`UserAvatar tests`, () => {
  it(`UserAvatar renders corrects`, () => {
    const tree = renderer.create(<UserAvatar
      alt="string"
      width={50}
      className="string"
      buffer="string"
      extension="jpeg"
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
