import React from 'react';
import renderer from 'react-test-renderer';
import Badge from './badge';

describe(`Badge tests`, () => {
  it(`Badge renders corrects`, () => {
    const tree = renderer.create(<Badge />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
