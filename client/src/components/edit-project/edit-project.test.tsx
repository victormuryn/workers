import React from 'react';
import renderer from 'react-test-renderer';
import EditProject from './edit-project';

describe(`EditProject tests`, () => {
  it(`EditProject renders corrects`, () => {
    const tree = renderer.create(<EditProject
      description=""
      onSubmit={() => {}}
      price={200}
      title="test"
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
