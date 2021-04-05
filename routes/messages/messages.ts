import * as http from 'http';
import {Server, Socket} from 'socket.io';

// we use "crypto" to generate random userID
import * as crypto from 'crypto';
const randomId = () => crypto.randomBytes(8).toString(`hex`);

// import stores
import InMemorySessionStore, {Session} from './sessionStore';
import InMemoryMessageStore, {Message} from './messageStore';

// init all stores
const sessionStore = new InMemorySessionStore();
const messageStore = new InMemoryMessageStore();

export interface MessageUser {
  userID: string,
  username: string,
  connected: boolean,
  messages: Array<Message>,
}

const messages = (server: http.Server) => {
  // main websocket server
  const io = new Server(server);

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error(`Wrong token`));
    }

    // find existing session
    const session = sessionStore.findSession(token);
    if (session) {
      socket.token = token;
      socket.userID = session.userID;
      socket.username = session.username;

      return next();
    }

    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error(`invalid username`));
    }

    socket.token = token;
    socket.userID = randomId();
    socket.username = username;

    next();
  });

  io.on(`connection`, (socket: Socket, next) => {
    const {userID, username, token, connected} = socket;

    if (!userID || !username || !token) {
      return next(new Error(`You are not auth`));
    }

    // persist session
    sessionStore.saveSession(token, {
      userID,
      username,
      connected: true,
    });

    // emit session details
    socket.emit(`session`, {
      userID,
    });

    // join the "userID" room
    socket.join(userID);

    // fetch existing users
    const users: Array<MessageUser> = [];
    const messagesPerUser = new Map();

    messageStore
      .findMessagesForUser(userID)
      .forEach((message: Message) => {
        const {from, to} = message;
        const otherUser = userID === from ? to : from;

        if (messagesPerUser.has(otherUser)) {
          messagesPerUser.get(otherUser).push(message);
        } else {
          messagesPerUser.set(otherUser, [messages]);
        }
      });

    sessionStore.findAllSessions().forEach((session: Session) => {
      users.push({
        userID,
        username,
        connected,
        messages: messagesPerUser.get(session.userID) || [],
      });
    });

    socket.emit(`users`, users);

    // notify existing users
    socket.broadcast.emit(`user connected`, {
      userID,
      username,
      connected: true,
    });

    // forward the private message to the right recipient
    // (and to other tabs of the sender)
    socket.on(`private message`, ({content, to}: Message) => {
      const message = {
        to,
        content,
        from: userID,
      };

      socket.to(to).to(userID).emit('private message', message);
      messageStore.saveMessage(message);
    });

    // notify users upon disconnection
    socket.on(`disconnect`, async () => {
      const matchingSockets = await io.in(userID).allSockets();
      const isDisconnected = matchingSockets.size === 0;

      if (isDisconnected) {
        // notify other users
        socket.broadcast.emit(`user disconnected`, userID);

        // update the connection status of the session
        sessionStore.saveSession(token, {
          userID,
          username,
          connected: false,
        });
      }
    });
  });
};

module.exports = messages;
