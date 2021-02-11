import React from 'react';
import renderer from 'react-test-renderer';
import InputGroup from './input-group';

describe(`InputGroup tests`, () => {
  it(`Input Group renders corrects`, () => {
    const tree = renderer.create(<InputGroup
      placeholder="Placeholder text"
      onChange={() => {}}
      label="Test group"
      required={false}
      minLength={1}
      value="test"
      name="test"
      type="text"
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
