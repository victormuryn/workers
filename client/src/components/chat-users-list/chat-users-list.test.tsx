import React from 'react';
import renderer from 'react-test-renderer';
import ChatUsersList from './chat-users-list';

describe(`ChatUsersList tests`, () => {
  it(`ChatUsersList renders corrects`, () => {
    const tree = renderer.create(<ChatUsersList
      users={[]}
      onUserSelect={() => {}}
      selectedUserID={undefined}
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
