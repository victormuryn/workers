import React from 'react';
import renderer from 'react-test-renderer';
import App from './app';

describe(`App tests`, () => {
  it(`App renders corrects`, () => {
    const tree = renderer.create(<App />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
