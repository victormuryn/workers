import React from 'react';

import './chat-box.scss';

import {MessageUser} from '../../redux/messages/types';
import ChatUserTopPanel from '../chat-user-top-panel/chat-user-top-panel';
import ChatMessagesList from '../chat-messages-list';
import ChatForm from '../chat-form';

interface Props {
  selectedUser: MessageUser | null;
  onMessageSubmit?: (text: string) => any,
}

const ChatBox: React.FC<Props> = ({
  selectedUser,
  onMessageSubmit = () => {},
}) => {
  const isSelectedUser = !!selectedUser;
  const {name, surname, username} = selectedUser || {};

  return (
    <>
      <ChatUserTopPanel name={name} surname={surname} username={username}/>

      <div className="chat-container">
        {
          isSelectedUser ?
            <ChatMessagesList selectedUser={selectedUser} /> :
            <p style={{
              height: `50vh`,
            }}>Виберіть користувача</p>
        }
      </div>

      <ChatForm
        disabled={!isSelectedUser}
        onMessageSubmit={onMessageSubmit}
        selectedUserID={selectedUser?.userID || null}
      />
    </>
  );
};

export default ChatBox;

// <>
//   {
//     isSelectedUser &&
//     <ChatUserTopPanel
//       name={name}
//       surname={surname}
//       username={username}
//     />
//   }
//
//   <div className="chat-container">
//     {
//       isSelectedUser ?
//         <ChatMessagesList selectedUser={selectedUser} /> :
//         <p>Виберіть користувача</p>
//     }
//
//     <ChatForm
//       disabled={!isSelectedUser}
//       onMessageSubmit={onMessageSubmit}
//       selectedUserID={selectedUser?.userID || null}
//     />
//   </div>
// </>
