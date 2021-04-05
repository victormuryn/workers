import React from 'react';
import renderer from 'react-test-renderer';
import UserSocialItem from './user-social-item';

describe(`UserSocialItem tests`, () => {
  it(`UserSocialItem renders corrects`, () => {
    const tree = renderer.create(<UserSocialItem
      onInputChange={() => {}}
      editable={true}
      title="instagram"
      value="tester"
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
