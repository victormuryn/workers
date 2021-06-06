import React from 'react';

import './chat-users-list.scss';

import Badge from 'react-bootstrap/Badge';
import Media from 'react-bootstrap/Media';

import UserAvatar from '../user-avatar';

import {formatDate} from '../../utils/utils';

import {MessageUser} from '../../redux/messages/types';

interface Props {
  selectedUserID: string | undefined,
  users: (MessageUser | undefined)[],
  onUserSelect: (user: MessageUser) => any,
}

const ChatUsersList: React.FC<Props> = ({
  users,
  onUserSelect,
  selectedUserID,
}) => {
  return (
    <ul className="users">
      {
        users.map((user) => {
          if (!user) return undefined;

          const {
            image, username, name, surname, messages,
            connected, userID, hasNewMessages,
          } = user;

          const isSelected = selectedUserID === userID;
          const lastMessage = messages
            ?.[messages.length - 1]
            ?.date;

          return (
            <Media
              as="li"
              key={userID}
              tabIndex={0}
              onClick={() => onUserSelect(user)}
              className={`person border-bottom
                ${isSelected ? `active-user` : ``}
              `}
            >
              <div className="position-relative me-3">
                <UserAvatar
                  width={50}
                  image={image}
                  username={username}
                />

                <span
                  className={`status ${connected ? `online` : `offline`}`}
                />
              </div>

              <Media.Body
                className="d-flex align-items-center
                 justify-content-between flex-grow-1"
              >
                <span>{name} {surname}
                  {
                    hasNewMessages &&
                      <Badge
                        variant="danger"
                        className="bg-danger ms-2"
                      >!</Badge>
                  }
                </span>

                <span className="small text-secondary">
                  {
                    lastMessage && `${formatDate(lastMessage)} тому`
                  }
                </span>
              </Media.Body>
            </Media>
          );
        })
      }
    </ul>
  );
};

export default React.memo(ChatUsersList);
