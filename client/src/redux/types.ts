import {AccountTypes, Project} from '../types/types';
import {Socket} from 'socket.io-client';

export const USER_LOGIN = `USER/LOGIN`;
export const USER_LOGOUT = `USER/LOGOUT`;

export const PROJECT_SET = `PROJECT/SET`;
export const PROJECT_ERROR = `PROJECT/ERROR`;
export const PROJECT_LOADING = `PROJECT/LOADING`;
export const PROJECT_REMOVE_BET = `PROJECT/REMOVE_BET`;

export const MESSAGES_INIT = `MESSAGES/INIT`;
export const MESSAGES_SET_USERS = `MESSAGES/SET_USERS`;
export const MESSAGES_SET_MESSAGE = `MESSAGES/SET_MESSAGE`;
export const MESSAGES_SET_NEW_USER = `MESSAGES/SET_NEW_USER`;
export const MESSAGES_CONNECT = `MESSAGES/CONNECT`;
export const MESSAGES_DISCONNECT = `MESSAGES/DISCONNECT`;
export const MESSAGES_SUBMIT = `MESSAGES/SUBMIT`;
export const MESSAGES_OFF = `MESSAGES/OFF`;
export const MESSAGES_SELECT_USER = `MESSAGES/SELECT_USER`;

export interface User {
  token: string,
  userId: string,
  accountType: AccountTypes,
  username: string
}

type Message = {
  content: string,
  fromSelf: boolean,
};

export type MessageUser = {
  username: string,
  userID: string,
  self: boolean,
  connected: boolean,
  hasNewMessages: boolean,
  messages: Message[],
}

interface UserLoginAction {
  type: typeof USER_LOGIN
  payload: User
}

interface UserLogoutAction {
  type: typeof USER_LOGOUT
}

interface ProjectSetDataAction {
  type: typeof PROJECT_SET,
  payload: Project,
}

interface ProjectSetError {
  type: typeof PROJECT_ERROR,
  payload: string | null,
}

interface ProjectSetLoading {
  type: typeof PROJECT_LOADING,
  payload: boolean,
}

interface ProjectRemoveBet {
  type: typeof PROJECT_REMOVE_BET,
  payload: string,
}

interface MessagesInit {
  type: typeof MESSAGES_INIT,
  payload: Socket,
}

interface MessagesSetUsers {
  type: typeof MESSAGES_SET_USERS,
  payload: MessageUser[],
}

interface MessagesSetMessage {
  type: typeof MESSAGES_SET_MESSAGE,
  payload: {
    content: string,
    from: string,
  },
}

interface MessagesSetNewUser {
  type: typeof MESSAGES_SET_NEW_USER,
  payload: MessageUser,
}

interface MessagesConnect {
  type: typeof MESSAGES_CONNECT,
}

interface MessagesDisconnect {
  type: typeof MESSAGES_DISCONNECT,
}

interface MessagesSubmit {
  type: typeof MESSAGES_SUBMIT,
  payload: string,
}

interface MessagesOff {
  type: typeof MESSAGES_OFF,
}

interface MessagesSelectUser {
  type: typeof MESSAGES_SELECT_USER,
  payload: MessageUser | null,
}

export type UserActionTypes = UserLoginAction | UserLogoutAction;
export type ProjectActionTypes =
  ProjectSetDataAction |
  ProjectSetError |
  ProjectSetLoading |
  ProjectRemoveBet;

export type MessagesTypes =
  MessagesInit |
  MessagesSetUsers |
  MessagesSetMessage |
  MessagesSetNewUser |
  MessagesConnect | MessagesDisconnect |
  MessagesSubmit | MessagesOff |
  MessagesSelectUser;

