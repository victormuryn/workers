import React from 'react';
import renderer from 'react-test-renderer';
import Footer from './footer';

describe(`Footer tests`, () => {
  it(`Footer renders corrects`, () => {
    const tree = renderer.create(<Footer />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it(`Footer with color renders corrects`, () => {
    const tree = renderer.create(<Footer color="#fafafa" />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
