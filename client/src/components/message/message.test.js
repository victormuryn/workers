import React from 'react';
import renderer from 'react-test-renderer';
import Message from './message';

describe(`Message tests`, () => {
  it(`Message danger renders corrects`, () => {
    const tree = renderer.create(<Message
      text="Test text for test"
      onClose={() => {}}
      type="danger"
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it(`Message without type renders corrects`, () => {
    const tree = renderer.create(<Message
      text="Test text for test"
      onClose={() => {}}
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
