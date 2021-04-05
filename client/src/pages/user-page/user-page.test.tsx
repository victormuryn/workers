import React from 'react';
import renderer from 'react-test-renderer';
import UserPage from './user-page';

describe(`UserPage tests`, () => {
  it(`UserPage renders corrects`, () => {
    const tree = renderer.create(<UserPage />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
