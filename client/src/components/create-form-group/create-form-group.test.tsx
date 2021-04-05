import React from 'react';
import renderer from 'react-test-renderer';
import CreateFormGroup from './create-form-group';

describe(`CreateFormGroup tests`, () => {
  it(`CreateFormGroup renders corrects`, () => {
    const tree = renderer.create(<CreateFormGroup
      title="test"
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
