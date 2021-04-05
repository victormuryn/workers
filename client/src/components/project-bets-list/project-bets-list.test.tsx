import React from 'react';
import renderer from 'react-test-renderer';
import ProjectBetsList from './project-bets-list';

describe(`ProjectBetsList tests`, () => {
  it(`ProjectBetsList renders corrects`, () => {
    const tree = renderer.create(<ProjectBetsList
      bets={[]}
      deleteClickHandler={() => {}}
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
