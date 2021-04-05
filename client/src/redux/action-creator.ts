import {Action, Dispatch} from 'redux';

import {
  PROJECT_SET,
  PROJECT_ERROR,
  PROJECT_LOADING,
  PROJECT_REMOVE_BET,
  ProjectActionTypes,
  User,
  USER_LOGIN,
  USER_LOGOUT,
  UserActionTypes,
  MESSAGES_INIT,
  MessagesTypes,
  MessageUser,
  MESSAGES_SET_USERS,
  MESSAGES_SET_MESSAGE,
  MESSAGES_SET_NEW_USER,
  MESSAGES_CONNECT,
  MESSAGES_DISCONNECT,
  MESSAGES_SUBMIT,
  MESSAGES_OFF,
  MESSAGES_SELECT_USER,
} from './types';
import api from '../utils/api';
import {Project, UserBet} from '../types/types';
import {io, Socket} from 'socket.io-client';

type Message = {
  content: string,
  from: string,
}

const AuthActions = {
  login: (data: User): UserActionTypes => ({
    type: USER_LOGIN,
    payload: {...data},
  }),

  logout: () => ({
    type: USER_LOGOUT,
  }),
};

const ProjectActions = {
  getProject: (id: string, token: string | null) =>
    async (dispatch: Dispatch) => {
      dispatch(ActionCreator.setLoading(true));
      dispatch(ActionCreator.setProjectError(null));

      return api
        .get<Project>(`/project/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then((response) => {
          return dispatch(ActionCreator.setProject(response.data));
        })
        .catch((error) => {
          const errorMessage = error.response.data.message ||
          `Щось пішло не так, спробуйте знову.`;

          return dispatch(ActionCreator.setProjectError(errorMessage));
        })
        .then(() => {
          return dispatch(ActionCreator.setLoading(false));
        });
    },

  setProjectError: (error: string | null): ProjectActionTypes => ({
    type: PROJECT_ERROR,
    payload: error,
  }),

  setProject: (project: Project): ProjectActionTypes => ({
    type: PROJECT_SET,
    payload: project,
  }),

  setLoading: (loading: boolean): ProjectActionTypes => ({
    type: PROJECT_LOADING,
    payload: loading,
  }),

  postBet: (bet: UserBet) => async () => {
    return api.post(`/bet/`, {
      ...bet,
      date: new Date(),
    }, {
      headers: {
        'Authorization': `Bearer ${bet.token}`,
      },
    });
  },

  deleteBet: (id: string, token: string):
    (dispatch: Dispatch<Action>) => Promise<void | Action> => {
    return async (dispatch) => {
      return api
        .delete(`/bet/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then(() => {
          dispatch(ActionCreator.removeBet(id));
        });
    };
  },

  removeBet: (id: string): ProjectActionTypes => ({
    type: PROJECT_REMOVE_BET,
    payload: id,
  }),
};

export const ActionCreator = {
  ...AuthActions,

  initMessages: (username: string, token: string) => (dispatch: Dispatch) => {
    const URL = 'http://localhost:8080';

    const socket = io(URL, {
      auth: {username, token},
    });

    socket.onAny((event, ...args) => {
      console.log(event, args);
    });

    socket.on('connect_error', (err: {message: string}) => {
      if (err.message === 'invalid username') new Error(err.message);
    });

    socket.on('users', (users: MessageUser[]) => {
      console.log(users)
      dispatch({
        type: MESSAGES_SET_USERS,
        payload: users,
      });
    });

    socket.on('user connected', (userResponse: MessageUser) => {
      const user = {
        ...userResponse,
        self: false,
        messages: [],
        connected: true,
        hasNewMessages: false,
      };

      dispatch({
        type: MESSAGES_SET_NEW_USER,
        payload: user,
      });
    });

    socket.on('private message', (message: Message) => dispatch({
      type: MESSAGES_SET_MESSAGE,
      payload: message,
    }));

    socket.on('connect', () => dispatch({
      type: MESSAGES_CONNECT,
    }));

    socket.on('disconnect', () => dispatch({
      type: MESSAGES_DISCONNECT,
    }));

    socket.on('session', (
      {userID}: {userID: string},
    ) => {
      // save the ID of the user
      // @ts-ignore
      socket.userID = userID;
    });

    return dispatch({
      type: MESSAGES_INIT,
      payload: socket,
    });
  },

  onMessageSubmit: (text: string): MessagesTypes => ({
    type: MESSAGES_SUBMIT,
    payload: text,
  }),

  selectUser: (user?: MessageUser | null): MessagesTypes => {
    if (user === undefined) {
      user = null;
    }

    return {
      type: MESSAGES_SELECT_USER,
      payload: user,
    };
  },

  offSocket: (): MessagesTypes => ({
    type: MESSAGES_OFF,
  }),

  ...ProjectActions,
};
