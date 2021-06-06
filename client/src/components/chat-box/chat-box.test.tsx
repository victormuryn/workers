import React from 'react';
import renderer from 'react-test-renderer';
import ChatBox from './chat-box';

describe(`ChatBox tests`, () => {
  it(`ChatBox renders corrects`, () => {
    const tree = renderer.create(<ChatBox
      onMessageSubmit={() => {}}
      selectedUser={null}
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
