import React from 'react';
import renderer from 'react-test-renderer';
import ChatMessagesList from './chat-messages-list';

describe(`ChatMessagesList tests`, () => {
  it(`ChatMessagesList renders corrects`, () => {
    const tree = renderer.create(<ChatMessagesList
      selectedUser={null}
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
