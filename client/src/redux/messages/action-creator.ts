import {Dispatch} from 'redux';
import {io} from 'socket.io-client';
import {
  MESSAGES_INIT,
  MESSAGES_OFF,

  MESSAGES_CONNECT,

  MESSAGES_SELECT_USER,

  MESSAGES_SET_USERS,

  MESSAGES_USER_CONNECTED,
  MESSAGES_USER_DISCONNECTED,

  MESSAGES_SET_MESSAGE,
  MESSAGES_SUBMIT,
  MESSAGES_UPDATE_READ,

  MessageUser,
  UserData,
  Message,
  MESSAGES_REMOVE_UNREAD,
  MESSAGES_GET_OLDEST_MESSAGES,
  MESSAGES_ADD_OLDEST_MESSAGES,
} from './types';

const ActionCreator = {
  initMessages: (username: string, token: string) => {
    return async (dispatch: Dispatch) => {
      const URL = 'http://localhost:5000';

      const socket = io(URL, {auth: {token}});

      socket.onAny((event, ...args) => {
        console.log(event, args);
      });

      socket.on(`connect_error`, (err: {message: string}) => {
        if (err.message === `invalid username`) new Error(err.message);
      });

      socket.on(`users`, (users: MessageUser[]) => {
        dispatch({
          type: MESSAGES_SET_USERS,
          payload: users,
        });
      });

      interface Data {
        messages: Message[],
        userID: string,
        more: boolean,
      }

      socket.on(`load_oldest_messages`, (data: Data) => {
        dispatch({
          type: MESSAGES_ADD_OLDEST_MESSAGES,
          payload: data,
        });
      });

      socket.on(`updateRead`, (from: string) => {
        dispatch({
          type: MESSAGES_UPDATE_READ,
          payload: from,
        });
      });

      socket.on(`user connected`, (userResponse: UserData) => {
        const user = {
          ...userResponse,
          self: false,
          messages: [],
          connected: true,
          hasNewMessages: false,
        };

        dispatch({
          type: MESSAGES_USER_CONNECTED,
          payload: user,
        });
      });

      socket.on(`user disconnected`, (userID: string) => {
        dispatch({
          type: MESSAGES_USER_DISCONNECTED,
          payload: userID,
        });
      });

      socket.on(`private message`, (message: Message) => {
        dispatch({
          type: MESSAGES_SET_MESSAGE,
          payload: message,
        });
      });

      socket.on(`connect`, () => {
        dispatch({
          type: MESSAGES_CONNECT,
        });
      });

      socket.on(`session`, ({userID}: {userID: string}) => {
        // save the ID of the user
        socket.userID = userID;
      });

      return dispatch({
        type: MESSAGES_INIT,
        payload: socket,
      });
    };
  },

  onMessageSubmit: (text: string) => ({
    type: MESSAGES_SUBMIT,
    payload: text,
  }),

  selectUser: (username?: string) => ({
    type: MESSAGES_SELECT_USER,
    payload: username,
  }),

  addUser: (userParam: UserData) => {
    const user = {
      ...userParam,
      self: false,
      messages: [],
      hasNewMessages: false,
    };

    return {
      type: MESSAGES_USER_CONNECTED,
      payload: user,
    };
  },

  getOlderMessages: (ID: string, skip: number) => ({
    type: MESSAGES_GET_OLDEST_MESSAGES,
    payload: {ID, skip},
  }),

  closeUnreadMessage: (index: number) => ({
    type: MESSAGES_REMOVE_UNREAD,
    payload: index,
  }),

  offSocket: () => ({
    type: MESSAGES_OFF,
  }),
};

export default ActionCreator;
