import React from 'react';
import renderer from 'react-test-renderer';
import Pagination from './pagination';

describe(`Pagination tests`, () => {
  it(`Pagination renders corrects`, () => {
    const tree = renderer.create(<Pagination />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
