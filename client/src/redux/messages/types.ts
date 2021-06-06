import {Socket} from 'socket.io-client';

export const MESSAGES_INIT = `MESSAGES/INIT`;
export const MESSAGES_OFF = `MESSAGES/OFF`;

export const MESSAGES_CONNECT = `MESSAGES/CONNECT`;

export const MESSAGES_SELECT_USER = `MESSAGES/SELECT_USER`;

export const MESSAGES_SET_USERS = `MESSAGES/SET_USERS`;
export const MESSAGES_USER_CONNECTED = `MESSAGES/USER_CONNECTED`;
export const MESSAGES_USER_DISCONNECTED = `MESSAGES/USER_DISCONNECTED`;

export const MESSAGES_GET_OLDEST_MESSAGES = `MESSAGES/GET_OLDEST_MESSAGES`;
export const MESSAGES_ADD_OLDEST_MESSAGES = `MESSAGES/ADD_OLDEST_MESSAGES`;

export const MESSAGES_UPDATE_READ = `MESSAGES/UPDATE_READ`;
export const MESSAGES_REMOVE_UNREAD= `MESSAGES/REMOVE_UNREAD`;

export const MESSAGES_SET_MESSAGE = `MESSAGES/SET_MESSAGE`;
export const MESSAGES_SUBMIT = `MESSAGES/SUBMIT`;

export interface Message {
  from: string,
  read: boolean,
  content: string,
  fromSelf: boolean,
  date: string | Date,
  _id: string,
}

export interface UserData {
  name: string
  more: boolean
  image: boolean
  userID: string
  surname: string
  username: string
  moreSent?: boolean
  connected: boolean
}

export interface MessageUser extends UserData {
  self: boolean;
  messages: Message[];
  hasNewMessages: boolean;
}

interface MessagesInit {
  type: typeof MESSAGES_INIT,
  payload: Socket,
}

interface MessagesOff {
  type: typeof MESSAGES_OFF,
}

interface MessagesConnect {
  type: typeof MESSAGES_CONNECT,
}

interface MessagesSelectUser {
  type: typeof MESSAGES_SELECT_USER,
  payload: string | undefined,
}

interface MessagesSetUsers {
  type: typeof MESSAGES_SET_USERS,
  payload: MessageUser[],
}

interface MessagesSetMessage {
  type: typeof MESSAGES_SET_MESSAGE,
  payload: {
    _id: string,
    content: string,
    from: string,
    date: string,
    read: boolean,
  },
}

interface MessagesUserConnected {
  type: typeof MESSAGES_USER_CONNECTED,
  payload: MessageUser,
}

interface MessagesUserDisconnected {
  type: typeof MESSAGES_USER_DISCONNECTED,
  payload: string,
}

interface MessagesSubmit {
  type: typeof MESSAGES_SUBMIT,
  payload: string,
}

interface MessagesUpdateRead {
  type: typeof MESSAGES_UPDATE_READ,
  payload: string,
}

interface MessagesRemoveUnread {
  type: typeof MESSAGES_REMOVE_UNREAD,
  payload: number,
}

interface MessagesGetOldestMessages {
  type: typeof MESSAGES_GET_OLDEST_MESSAGES,
  payload: {
    ID: string,
    skip: number,
  }
}

interface MessagesLoadOldestMessages {
  type: typeof MESSAGES_ADD_OLDEST_MESSAGES,
  payload: {
    userID: string,
    more: boolean,
    messages: Message[],
  }
}

export type MessagesTypes =
  MessagesInit |
  MessagesOff |

  MessagesConnect |

  MessagesSelectUser |

  MessagesGetOldestMessages |
  MessagesLoadOldestMessages |

  MessagesSetUsers |
  MessagesSetMessage |
  MessagesUserConnected |
  MessagesUserDisconnected |

  MessagesSubmit |
  MessagesUpdateRead |
  MessagesRemoveUnread;
