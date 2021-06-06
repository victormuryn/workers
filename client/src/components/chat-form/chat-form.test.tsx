import React from 'react';
import renderer from 'react-test-renderer';
import ChatForm from './chat-form';

describe(`ChatForm tests`, () => {
  it(`ChatForm renders corrects`, () => {
    const tree = renderer.create(<ChatForm

    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
