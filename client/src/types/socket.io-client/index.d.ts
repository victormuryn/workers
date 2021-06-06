import {Socket as OriginalSocket} from 'socket.io-client';

declare module 'socket.io-client' {
  /**
   * This is original socket, but with extra properties
   */
  export declare class Socket extends OriginalSocket {
    token?: string;
    name?: string;
    userID?: string;
    image?: boolean;
    surname?: string;
    username?: string;
  }
}
