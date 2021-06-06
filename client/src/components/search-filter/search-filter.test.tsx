import React from 'react';
import renderer from 'react-test-renderer';
import SearchFilter from './search-filter';

describe(`SearchFilter tests`, () => {
  it(`SearchFilter renders corrects`, () => {
    const tree = renderer.create(<SearchFilter
      onSubmit={() => {}}
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
