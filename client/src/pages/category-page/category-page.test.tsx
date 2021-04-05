import React from 'react';
import renderer from 'react-test-renderer';
import CategoryPage from './category-page';

describe(`CategoryPage tests`, () => {
  it(`CategoryPage renders corrects`, () => {
    const tree = renderer.create(<CategoryPage />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
