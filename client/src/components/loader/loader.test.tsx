import React from 'react';
import renderer from 'react-test-renderer';
import Loader from './loader';

describe(`Loader tests`, () => {
  it(`Loader renders corrects`, () => {
    const tree = renderer.create(<Loader />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
