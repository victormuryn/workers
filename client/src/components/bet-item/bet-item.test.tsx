import React from 'react';
import renderer from 'react-test-renderer';
import BetItem from './bet-item';

describe(`BetItem tests`, () => {
  it(`BetItem renders corrects`, () => {
    const tree = renderer.create(<BetItem
      term={2}
      price={200}
      author={{
        _id: `string`,
        image: {
          buffer: ``,
          extension: ``,
        },
        name: `string`,
        surname: `string`,
        username: `string`,
        location: {
          city: ``,
          country: ``,
        }
      }}
      _id="string"
      text="string"
      date="string"
      onDeleteClick={() => {}}
      updated={{
        count: 2,
        lastDate: `string`,
      }}/>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
