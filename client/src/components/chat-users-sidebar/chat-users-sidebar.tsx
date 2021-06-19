import React from 'react';

import './chat-users-sidebar.scss';

import UserAvatar from '../user-avatar';

import {MessageUser} from '../../redux/messages/types';
import {last} from '../../utils/utils';

interface Props {
  users?: MessageUser[],
  selectedUserID?: string,
  onUserSelect?: (user: MessageUser) => any,
}

const ChatUsersSidebar: React.FC<Props> = ({
  users= [],
  selectedUserID,
  onUserSelect = () => {},
}) => {
  // const unreadUsers = users.filter((user) => user.hasNewMessages);

  return (
    <div className="users-container">
      <div className="chat-search-box">
        <div className="input-group">
          <input className="form-control" placeholder="Search" />
          <div className="input-group-btn">
            <button type="button" className="btn btn-info">
              <i className="fa fa-search" />
            </button>
          </div>
        </div>
      </div>

      <ul className="users">
        {
          users.map((user) => {
            const fullName = `${user.name} ${user.surname}`;

            const lastMessageDate = last(user.messages)?.date || 0;
            const lastMessage = new Date(lastMessageDate).toLocaleDateString();

            return (
              <li
                tabIndex={1}
                key={user.username}
                onClick={() => onUserSelect(user)}
                className={`person
                  ${user.userID === selectedUserID && `active-user`}
                `}
              >
                <div className="user">
                  <UserAvatar
                    alt={fullName}
                    buffer={user.image.buffer}
                    extension={user.image.extension}
                  />
                  <span
                    className={`status ${user.connected ? `on` : `off`}line`}
                  />
                </div>
                <p className="name-time">
                  <span className="name">{fullName} </span>
                  <span className="time">{lastMessage}</span>
                </p>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default React.memo(ChatUsersSidebar);

// <Tabs defaultActiveKey="all" id="chat-tab">
//   <Tab eventKey="all" title="Усі">
//     {
//       users.length ?
//         <ChatUsersList
//           users={users}
//           onUserSelect={onUserSelect}
//           selectedUserID={selectedUserID}
//         /> :
//         <p className="text-center my-5">У вас поки немає повідомлень</p>
//     }
//   </Tab>
//
//   <Tab eventKey="unread" title="Непрочитані">
//     {
//       unreadUsers.length ?
//         <ChatUsersList
//           users={unreadUsers}
//           onUserSelect={onUserSelect}
//           selectedUserID={selectedUserID}
//         /> :
//         <p className="text-center my-5">
//           У вас немає непрочитаних повідомлень
//         </p>
//     }
//   </Tab>
// </Tabs>

