import React from 'react';
import renderer from 'react-test-renderer';
import Dropdown from './dropdown';

describe(`Dropdown tests`, () => {
  it(`Dropdown renders corrects`, () => {
    const tree = renderer.create(<Dropdown
      title="text"
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
