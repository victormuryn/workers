import {Socket as OriginalSocket} from 'socket.io';

declare module 'socket.io' {
  /**
   * This is original socket, but with token, userID and username
   */
  export declare class Socket extends OriginalSocket {
    token?: string;
    userID?: string;
    username?: string;
  }
}
