import React, {useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import './chat-page.scss';

import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import ChatBox from '../../components/chat-box';
import ChatUsersSidebar from '../../components/chat-users-sidebar';

import {State} from '../../redux/reducer';
import {MessageUser} from '../../redux/messages/types';

import {ActionCreator} from '../../redux/action-creator';
import {getPluralNoun, setPageMeta} from '../../utils/utils';

const ChatPage: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const query = new URLSearchParams(location.search);
  const name = query.get(`user`);

  const {
    users,
    selectedUser,
  } = useSelector((state: State) => ({
    users: state.messages.users,
    selectedUser: state.messages.selectedUser,
  }));

  const unread = users
    .filter((user) => user.hasNewMessages)
    .length;

  const title = unread ?
    getPluralNoun(unread, [`нове повідомлення`, `нових повідомлень`]) :
    `Повідомлення`;

  setPageMeta(title);

  const onMessageSubmit = (text: string) => {
    dispatch(ActionCreator.onMessageSubmit(text));
  };

  const setSelectedUser = (user: MessageUser) => {
    if (selectedUser?.userID !== user.userID) {
      history.push({search: `?user=${user.username}`});
      dispatch(ActionCreator.selectUser(user.username));
    }
  };

  useEffect(() => {
    if (name) {
      dispatch(ActionCreator.selectUser(name));
    }

    return () => {
      dispatch(ActionCreator.selectUser());
    };
  }, [name]);

  return (
    <Container className="mt-4 bg-white g-0">
      <Row className="border g-0">
        {/* Users box*/}
        <ChatUsersSidebar
          users={users}
          onUserSelect={setSelectedUser}
          selectedUserID={selectedUser?.userID}
        />

        {/* Chat Box*/}
        <ChatBox
          selectedUser={selectedUser}
          onMessageSubmit={onMessageSubmit}
        />
      </Row>
    </Container>
  );
};

export default ChatPage;
