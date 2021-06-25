import React from 'react';
import renderer from 'react-test-renderer';
import Button from './button';

describe(`Button tests`, () => {
  it(`Button renders corrects`, () => {
    const tree = renderer.create(<Button />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
