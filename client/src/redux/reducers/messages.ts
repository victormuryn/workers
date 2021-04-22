import {
  MESSAGES_CONNECT,
  MESSAGES_DELETE_USER,
  MESSAGES_DISCONNECT,
  MESSAGES_INIT,
  MESSAGES_OFF,
  MESSAGES_SELECT_USER,
  MESSAGES_SELECT_USER_BY_NAME,
  MESSAGES_SET_MESSAGE,
  MESSAGES_SET_NEW_USER,
  MESSAGES_SET_USERS,
  MESSAGES_SUBMIT,
  MessagesTypes,
  MessageUser,
} from '../types';
import {Socket} from 'socket.io-client';

export type State = {
  selectedUser: MessageUser | null;
  users: MessageUser[],
  socket: Socket | null;
  unread: Array<{
    from: string,
    message: string,
  }>,
}

const initialState: State = {
  users: [],
  unread: [],
  socket: null,
  selectedUser: null,
};

export default (
  state = initialState,
  action: MessagesTypes,
): State => {
  switch (action.type) {
  case MESSAGES_INIT:
    return {...state, socket: action.payload};

  case MESSAGES_SET_USERS: {
    const actionUsers = action.payload;
    const users = [...state.users];

    actionUsers.forEach((user) => {
      user.messages.forEach((message) => {
        if (message) {
          message.fromSelf = message.from === state.socket?.userID;
        }
      });

      for (let i = 0; i < users.length; i++) {
        const existingUser = users[i];

        if (existingUser.userID === user.userID) {
          existingUser.connected = user.connected;
          existingUser.messages = user.messages;
          return;
        }
      }

      user.self = user.userID === state.socket?.userID;
      user.messages = user.messages || [];
      user.hasNewMessages = user.hasNewMessages || false;
      user.connected = user.connected || true;

      users.push(user);
    });

    // put the current user first, and then sort by username
    users.sort((a, b) => {
      if (a.self) return -1;
      if (b.self) return 1;
      if (a.username < b.username) return -1;
      return a.username > b.username ? 1 : 0;
    });

    return {...state, users};
  }

  case MESSAGES_SET_MESSAGE: {
    const {content, from} = action.payload;
    const users = [...state.users];
    const unread = [...state.unread];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      if (user.userID === from) {
        user.messages.push({
          from,
          content,
          date: new Date(),
          fromSelf: false,
        });

        if (user.userID !== state.selectedUser?.userID) {
          user.hasNewMessages = true;
          unread.push({
            from: user.username,
            message: content.length > 90 ?
              `${content.slice(0, 87)}...` :
              content,
          });

          const audio = new Audio(`/message.mp3`);
          audio.volume = 0.4;
          audio.addEventListener(`canplaythrough`, () => audio.play());
        }

        break;
      }
    }
    return {...state, users, unread};
  }

  case MESSAGES_SET_NEW_USER: {
    const users = [...state.users];

    for (let i = 0; i < users.length; i++) {
      const existingUser = users[i];

      if (existingUser.userID === action.payload.userID) {
        existingUser.connected = true;
        return {...state, users: [...users]};
      }
    }

    return {...state, users: [...state.users, action.payload]};
  }

  // case MESSAGES_DELETE_USER: {
  //   // const users = state.users
  //   //   .filter((user) => user.userID !== action.payload);
  //   //
  //   // return {...state, users};
  // }

  case MESSAGES_CONNECT: {
    const users = [...state.users];

    users.forEach((user) => {
      if (user.self) user.connected = true;
    });

    return {...state, users};
  }

  case MESSAGES_DISCONNECT: {
    const users = [...state.users];

    users.forEach((user) => {
      if (user.self) user.connected = false;
    });

    return {...state, users};
  }

  case MESSAGES_SUBMIT:
    if (state.socket && state.selectedUser) {
      state.socket.emit('private message', {
        content: action.payload,
        to: state.selectedUser.userID,
      });

      state.selectedUser.messages.push({
        content: action.payload,
        fromSelf: true,
        date: new Date(),
        from: state.socket.userID || ``,
      });
    }

    break;

  case MESSAGES_OFF:
    state.socket?.off(`connect_error`);
    break;

  case MESSAGES_SELECT_USER: {
    const selectedUser = action.payload;

    if (selectedUser === null || !selectedUser.hasNewMessages) {
      return {
        ...state,
        selectedUser,
      };
    }

    const unread = [...state.unread]
      .filter((e) => e.from !== selectedUser.username);

    const users = [...state.users];
    const usersIndex = users.findIndex((e) => e.userID === selectedUser.userID);
    users[usersIndex].hasNewMessages = false;

    return {
      ...state,
      users,
      unread,
      selectedUser,
    };
  }

  case MESSAGES_SELECT_USER_BY_NAME: {
    const selectedUser = action.payload;
    const user = state.users
      .find((element) => element.username === selectedUser);

    if (!selectedUser || !user) {
      return {
        ...state,
        selectedUser: null,
      };
    }

    const unread = [...state.unread]
      .filter((e) => e.from !== selectedUser);

    const users = [...state.users];
    const usersIndex = users.findIndex((e) => e.username === selectedUser);
    users[usersIndex].hasNewMessages = false;

    return {
      ...state,
      users,
      unread,
      selectedUser: user,
    };
  }
  }


  return state;
};
