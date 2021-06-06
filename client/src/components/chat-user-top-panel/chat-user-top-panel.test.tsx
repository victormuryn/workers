import React from 'react';
import renderer from 'react-test-renderer';
import ChatUserTopPanel from './chat-user-top-panel';

describe(`ChatUserTopPanel tests`, () => {
  it(`ChatUserTopPanel renders corrects`, () => {
    const tree = renderer.create(<ChatUserTopPanel />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
