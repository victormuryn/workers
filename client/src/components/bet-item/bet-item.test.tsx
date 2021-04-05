import React from 'react';
import renderer from 'react-test-renderer';
import BetItem from './bet-item';

describe(`BetItem tests`, () => {
  it(`BetItem renders corrects`, () => {
    const tree = renderer.create(<BetItem
      term={2}
      price={200}
      author="id"
      _id="string"
      text="string"
      date="string"
      onDeleteClick={() => {}}
      betAuthor={{
        image: true,
        _id: `string`,
        name: `string`,
        surname: `string`,
        username: `string`,
      }}
      updated={{
        count: 2,
        lastDate: `string`,
      }}/>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
