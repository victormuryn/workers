import {
  MESSAGES_ADD_OLDEST_MESSAGES,
  MESSAGES_CONNECT,
  MESSAGES_GET_OLDEST_MESSAGES,
  MESSAGES_INIT,
  MESSAGES_OFF,
  MESSAGES_REMOVE_UNREAD,
  MESSAGES_SELECT_USER,
  MESSAGES_SET_MESSAGE,
  MESSAGES_SET_USERS,
  MESSAGES_SUBMIT,
  MESSAGES_UPDATE_READ,
  MESSAGES_USER_CONNECTED,
  MESSAGES_USER_DISCONNECTED,
  MessagesTypes,
  MessageUser,
} from './types';

import {Socket} from 'socket.io-client';
import {last, spreadAndAdd} from '../../utils/utils';
import {Image} from '../../types/types';

export type State = {
  selectedUser: MessageUser | null;
  users: MessageUser[],
  socket: Socket | null;
  unread: Array<{
    from: string,
    image: Image,
    message: string,
  }>,
}

const initialState: State = {
  users: [],
  unread: [],
  socket: null,
  selectedUser: null,
};

const playNotificationSound = () => {
  const audio = new Audio(`/message.mp3`);
  audio.volume = 0.4;
  audio.addEventListener(`canplaythrough`, () => audio.play());
};

export default (
  state = initialState,
  action: MessagesTypes,
): State => {
  switch (action.type) {
  case MESSAGES_INIT: {
    return {
      ...state,
      socket: action.payload,
    };
  }

  case MESSAGES_OFF: {
    state.socket?.disconnect();
    return {...initialState};
  }

  case MESSAGES_CONNECT: {
    const users = [...state.users];

    users.forEach((user) => {
      if (user.self) user.connected = true;
    });

    return {...state, users};
  }

  case MESSAGES_SELECT_USER: {
    const username = action.payload;

    const user = state.users.find((user) => {
      return user.username === username;
    });

    if (!username || !user) {
      return {
        ...state,
        selectedUser: null,
      };
    }

    const lastMessage = last(user.messages);
    if (lastMessage && !lastMessage.fromSelf && !lastMessage.read) {
      state.socket?.emit(`read`, {
        from: state.socket?.userID,
        to: user.userID,
      });

      lastMessage.read = true;
    }


    if (!user.hasNewMessages) {
      return {
        ...state,
        selectedUser: user,
      };
    }

    const unread = [...state.unread].filter((e) => {
      return e.from !== username;
    });

    user.hasNewMessages = false;

    return {
      ...state,
      unread,
      selectedUser: user,
    };
  }

  case MESSAGES_GET_OLDEST_MESSAGES:
    if (!state.selectedUser) return state;

    state.socket?.emit(`get_oldest_messages`, action.payload);

    return {
      ...state,
      selectedUser: {
        ...state.selectedUser,
        moreSent: true,
      },
    };

  case MESSAGES_ADD_OLDEST_MESSAGES:
    const {messages, userID, more} = action.payload;
    const users = [...state.users];
    const selectedUser = state.selectedUser ? {...state.selectedUser} : null;

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      if (user.userID === userID) {
        messages.forEach((message) => {
          if (message) {
            message.fromSelf = message.from === state.socket?.userID;
          }
        });

        const newMessages = [...messages, ...user.messages];

        user.more = more;
        user.moreSent = false;
        user.messages = newMessages;

        if (selectedUser && selectedUser.userID === userID) {
          selectedUser.more = more;
          selectedUser.moreSent = false;
          selectedUser.messages = newMessages;
        }

        break;
      }
    }

    return {...state, users, selectedUser};

  case MESSAGES_SET_USERS: {
    const actionUsers = action.payload;
    const users = [...state.users];

    actionUsers.forEach((user) => {
      user.messages.forEach((message) => {
        if (message) {
          message.fromSelf = message.from === state.socket?.userID;
        }
      });

      const lastMessage = last(user.messages);
      const hasNewMessages = !lastMessage?.fromSelf && !lastMessage?.read;

      for (let i = 0; i < users.length; i++) {
        const existingUser = users[i];

        if (existingUser.userID === user.userID) {
          existingUser.messages = user.messages;
          existingUser.connected = user.connected;
          existingUser.hasNewMessages = hasNewMessages;
          return;
        }
      }

      user.self = user.userID === state.socket?.userID;
      user.messages = user.messages || [];
      user.hasNewMessages = hasNewMessages;
      user.connected = user.connected || false;

      users.push(user);
    });

    // put the current user first, and then sort by username
    users.sort((a, b) => {
      const aLast = a.messages?.[a.messages.length - 1]?.date;
      const bLast = b.messages?.[b.messages.length - 1]?.date;

      return +(new Date(bLast)) - +(new Date(aLast));
    });

    return {
      ...state,
      users,
    };
  }

  case MESSAGES_USER_CONNECTED: {
    const user = action.payload;
    const users = [...state.users];

    for (let i = 0; i < users.length; i++) {
      const existingUser = users[i];

      if (existingUser.userID === user.userID) {
        existingUser.connected = true;
        return {...state, users};
      }
    }

    users.unshift(user);
    return {...state, users};
  }

  case MESSAGES_USER_DISCONNECTED: {
    const user = action.payload;
    const users = [...state.users];

    for (let i = 0; i < users.length; i++) {
      const existingUser = users[i];

      if (existingUser.userID === user) {
        existingUser.connected = false;
        break;
      }
    }

    return {...state, users};
  }

  case MESSAGES_SET_MESSAGE: {
    const {content, from} = action.payload;

    const users = [...state.users];
    const unread = [...state.unread];
    const selectedUserId = state.selectedUser?.userID;

    const msg = {
      ...action.payload,
      fromSelf: false,
    };

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      if (user.userID === from) {
        user.messages.push(msg);

        if (user.userID !== selectedUserId) {
          user.hasNewMessages = true;

          unread.push({
            image: user.image,
            from: user.username,
            message: content.length > 90 ?
              `${content.slice(0, 87)}...` :
              content,
          });

          playNotificationSound();
        } else {
          state.socket?.emit(`read`, {
            from: state.socket?.userID,
            to: selectedUserId,
          });
        }

        break;
      }
    }

    return {
      ...state,
      users, unread,
    };
  }

  case MESSAGES_SUBMIT:
    if (state.socket && state.selectedUser) {
      const now = new Date();

      state.socket.emit('private message', {
        content: action.payload,
        to: state.selectedUser.userID,
        date: now,
      });

      const messages = [...state.selectedUser.messages];
      messages.push({
        _id: Math.random().toString(36).substr(2, 9),
        date: now,
        read: false,
        fromSelf: true,
        content: action.payload,
        from: state.socket.userID || ``,
      });

      return spreadAndAdd<State>(
        state,
        [`selectedUser.messages`, messages],
      );
    }

    return {...state};

  case MESSAGES_UPDATE_READ: {
    const from = action.payload;
    const users = [...state.users];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      if (user.userID === from) {
        for (let i = user.messages.length - 1; i >= 0; i--) {
          const message = user.messages[i];

          if (message.fromSelf && message.read) break;
          message.read = true;
        }

        break;
      }
    }

    return {...state, users};
  }

  case MESSAGES_REMOVE_UNREAD: {
    const unread = [...state.unread];
    unread.splice(action.payload, 1);

    return {...state, unread};
  }
  }

  return state;
};
