import React from 'react';
import renderer from 'react-test-renderer';
import ChatMessage from './chat-message';

describe(`ChatMessage tests`, () => {
  it(`ChatMessage renders corrects`, () => {
    const tree = renderer.create(<ChatMessage
      message={{
        content: '',
        date: new Date(),
        fromSelf: false,
        image: {
          extension: `png`,
          buffer: ``,
        },
        name: 'tester',
        username: 'tester',
        showAvatar: false,
      }}
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
