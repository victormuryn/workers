import React from 'react';
import renderer from 'react-test-renderer';
import ChatPage from './chat-page';

describe(`ChatPage tests`, () => {
  it(`ChatPage renders corrects`, () => {
    const tree = renderer.create(<ChatPage />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
