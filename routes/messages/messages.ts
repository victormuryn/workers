import * as http from 'http';

import * as jwt from 'jsonwebtoken';
import * as config from 'config';

import {Server, Socket} from 'socket.io';

// import stores
import InMemorySessionStore, {Session} from './sessionStore';
import DBMessageStore from './messageStore';

import User from '../../models/User';
import {ChatType} from '../../models/Chat';
import {LeanDocument} from 'mongoose';

// init all stores
const sessionStore = new InMemorySessionStore();
const messageStore = new DBMessageStore();

export interface MessageUser {
  userID: string,
  username: string,
  connected: boolean,
  messages: Array<ChatType>,
}

type Message = {
  from: string,
  to: string,
  content: string,
}

module.exports = (server: http.Server) => {
  // main websocket server
  const io = new Server(server);

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error(`There is no token`));
    }

    // find existing session
    const userId = jwt.decode(token, config.get(`jwtPhrase`))?.userId;
    if (!userId) return next(new Error(`Wrong token`));

    socket.userID = userId;

    const session = sessionStore.findSession(userId);
    if (session) {
      socket.name = session.name;
      socket.image = session.image;
      socket.surname = session.surname;
      socket.username = session.username;
      socket.fullName = session.fullName;
    }

    return next();
  });

  io.on(`connection`, async (socket: Socket) => {
    const {userID} = socket;

    if (!userID) {
      return console.error(new Error(`You are not auth. Use token`));
    }

    const userModel = await User
      .findById(userID)
      .select(`image username name surname`)
      .lean();

    if (!userModel) {
      return console.error(new Error(`User with this id isn't found`));
    }

    const user = {
      userID,
      connected: true,
      name: userModel.name,
      image: userModel.image,
      surname: userModel.surname,
      username: userModel.username,
      fullName: `${userModel.name} ${userModel.surname}`,
    };

    // persist session
    sessionStore.saveSession(userID, user);

    // emit session details
    socket.emit(`session`, {userID});

    // join the "userID" room
    socket.join(userID);

    // fetch existing users
    const users: Array<MessageUser> = [];
    const messagesPerUser = new Map();

    await messageStore.findMessagesForUser(userID, (error, messages) => {
      if (error) return console.log(error);

      messages.forEach((message: LeanDocument<ChatType>) => {
        const from = message.from.toString();
        const to = message.to.toString();

        const otherUser = userID === from ? to : from;

        const msg = {
          ...message,
          to, from,
          fromSelf: userID === from,
        };

        if (messagesPerUser.has(otherUser)) {
          return messagesPerUser.get(otherUser).push(msg);
        }

        messagesPerUser.set(otherUser, [msg]);
      });
    });

    sessionStore
      .findAllSessions()
      .forEach((session: Session) => {
        const messages = messagesPerUser.get(session.userID) || [];

        users.push({...session, messages});
      });

    socket.emit(`users`, users);

    // notify existing users
    socket.broadcast.emit(`user connected`, user);

    // forward the private message to the right recipient
    // (and to other tabs of the sender)
    socket.on(`private message`, ({content, to}: Message) => {
      const message = {
        to, content,
        from: userID,
        date: new Date(),
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
        // socket.broadcast.emit(`user disconnected`, userID);

        // update the connection status of the session
        sessionStore.saveSession(userID, {
          ...user,
          connected: false,
        });
      }
    });
  });
};
