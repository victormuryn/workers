import React from 'react';

import './chat-users-sidebar.scss';

import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import ChatUsersList from '../chat-users-list';

import {MessageUser} from '../../redux/messages/types';

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
  const unreadUsers = users.filter((user) => user.hasNewMessages);

  return (
    <Col md={4} xs={12} className="border-end">
      <Tabs defaultActiveKey="all" id="chat-tab">
        <Tab eventKey="all" title="Усі">
          {
            users.length ?
              <ChatUsersList
                users={users}
                onUserSelect={onUserSelect}
                selectedUserID={selectedUserID}
              /> :
              <p className="text-center my-5">У вас поки немає повідомлень</p>
          }
        </Tab>

        <Tab eventKey="unread" title="Непрочитані">
          {
            unreadUsers.length ?
              <ChatUsersList
                users={unreadUsers}
                onUserSelect={onUserSelect}
                selectedUserID={selectedUserID}
              /> :
              <p className="text-center my-5">
                У вас немає непрочитаних повідомлень
              </p>
          }
        </Tab>
      </Tabs>
    </Col>
  );
};

export default React.memo(ChatUsersSidebar);
