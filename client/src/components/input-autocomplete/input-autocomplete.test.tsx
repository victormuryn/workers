import React from 'react';
import renderer from 'react-test-renderer';
import InputAutocomplete from './input-autocomplete';

describe(`InputAutocomplete tests`, () => {
  it(`InputAutocomplete renders corrects`, () => {
    const tree = renderer.create(<InputAutocomplete
      value={3}
      inputName="name"
      suggestions={[]}
      selectName="select-name"
      onInputChange={() => {}}
      onSelectChange={() => {}}
      placeholder="placeholder"
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
