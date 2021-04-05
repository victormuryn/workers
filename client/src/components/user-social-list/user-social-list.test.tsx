import React from 'react';
import renderer from 'react-test-renderer';
import UserSocialList from './user-social-list';

describe(`UserSocialList tests`, () => {
  it(`UserSocialList renders corrects`, () => {
    const tree = renderer.create(<UserSocialList
      onInputChange={() => {}}
      editable={true}
      social={{
        instagram: `test`,
        github: `test123`,
      }}/>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
