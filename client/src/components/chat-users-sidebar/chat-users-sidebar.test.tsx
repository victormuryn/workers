import React from 'react';
import renderer from 'react-test-renderer';
import ChatUsersSidebar from './chat-users-sidebar';

describe(`ChatUsersList tests`, () => {
  it(`ChatUsersList renders corrects`, () => {
    const tree = renderer.create(<ChatUsersSidebar
      users={[]}
      onUserSelect={() => {}}
      selectedUserID={undefined}
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
