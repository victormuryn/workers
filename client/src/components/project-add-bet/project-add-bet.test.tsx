import React from 'react';
import renderer from 'react-test-renderer';
import ProjectAddBet from './project-add-bet';

describe(`ProjectAddBet tests`, () => {
  it(`ProjectAddBet renders corrects`, () => {
    const tree = renderer.create(<ProjectAddBet
      price={100}
      onFormSubmit={() => {}}
      inputChangeHandler={() => {}}
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
