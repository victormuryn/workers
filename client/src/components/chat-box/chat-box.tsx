import React from 'react';

import './chat-box.scss';

import Col from 'react-bootstrap/Col';

import ChatForm from '../chat-form';
import ChatUserTopPanel from '../chat-user-top-panel';
import ChatMessagesList from '../chat-messages-list';
import {MessageUser} from '../../redux/messages/types';

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
    <Col md={8} xs={12}>
      {
        isSelectedUser &&
          <ChatUserTopPanel
            name={name}
            surname={surname}
            username={username}
          />
      }

      <div className="chat-container">
        {
          isSelectedUser ?
            <ChatMessagesList selectedUser={selectedUser} /> :
            <p>Виберіть користувача</p>
        }

        <ChatForm
          disabled={!isSelectedUser}
          onMessageSubmit={onMessageSubmit}
          selectedUserID={selectedUser?.userID || null}
        />
      </div>
    </Col>
  );
};

export default ChatBox;
