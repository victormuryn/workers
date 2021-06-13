import React from 'react';
import renderer from 'react-test-renderer';
import EditBar from './edit-bar';

describe(`EditBar tests`, () => {
  it(`EditBar renders corrects`, () => {
    const tree = renderer.create(<EditBar
      modalText="123"
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
