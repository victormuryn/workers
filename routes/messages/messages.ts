import * as http from 'http';

import * as jwt from 'jsonwebtoken';
import * as config from 'config';

import {Server, Socket} from 'socket.io';

// import stores
import InMemorySessionStore from './sessionStore';
import DBMessageStore from './messageStore';

import User from '../../models/User';
import {ChatType} from '../../models/Chat';

// init all stores
const sessionStore = new InMemorySessionStore();
const messageStore = new DBMessageStore();

export interface MessageUser {
  more: boolean,
  userID: string,
  username: string,
  connected: boolean,
  messages: Array<ChatType>,
}

type Message = {
  from: string,
  to: string,
  content: string,
  read: boolean,
}

interface MessagesPerUser {
  more: boolean,
  messages: ChatType[],
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
    };

    // persist session
    sessionStore.saveSession(userID, user);

    // emit session details
    socket.emit(`session`, {userID});

    // join the "userID" room
    socket.join(userID);

    // fetch existing users
    const users: Array<MessageUser> = [];
    const messagesPerUser = new Map<string, MessagesPerUser>();

    await messageStore.findMessagesForUser(userID, (error, messages) => {
      if (error) return console.log(error);

      messages.forEach(({more, messages}) => {
        messages.forEach((message) => {
          const from = message.from.toString();
          const to = message.to.toString();

          const otherUser = userID === from ? to : from;

          const msg = {
            ...message,
            to, from,
            fromSelf: userID === from,
          };

          if (messagesPerUser.has(otherUser)) {
            return messagesPerUser.get(otherUser)!.messages.push(msg);
          }

          messagesPerUser.set(otherUser, {more, messages: [msg]});
        });
      });
    });

    const messagesPerUserKeys = messagesPerUser.keys();
    for (let i = 0; i < messagesPerUser.size; i++) {
      const key = messagesPerUserKeys.next().value;
      const messages = messagesPerUser.get(key);

      socket.to(key).emit(`user connected`, user);

      const newMessagesUser = sessionStore.findSession(key);
      if (newMessagesUser) {
        users.push({...newMessagesUser, ...messages});
        continue;
      }

      const dbUser = await User
        .findById(key)
        .select(`-_id name username surname image`)
        .lean();

      if (!dbUser) continue;

      // @ts-ignore - messages 100% in Map, 'cause we've been used .keys()
      users.push({
        ...dbUser,
        ...messages,
        userID: key,
        connected: false,
      });
    }

    socket.emit(`users`, users);

    // forward the private message to the right recipient
    // (and to other tabs of the sender)
    socket.on(`private message`, async ({content, to}: Message) => {
      const message = {
        to, content,
        read: false,
        from: userID,
        date: new Date(),
      };

      const isMessagesBetweenUsers = await messageStore
        .isMessagesBetweenUsers(userID, to);

      if (!isMessagesBetweenUsers) {
        socket.to(to).emit(`user connected`, user);
      }

      socket.to(to).emit('private message', {
        ...message,
        _id: Math.random().toString(36).substr(2, 9),
      });

      await messageStore.saveMessage(message);
    });

    socket.on(`get_oldest_messages`, async (data) => {
      const {ID, skip} = data as {ID: string, skip: number};
      const messages = await messageStore.getMessagesForUsers(userID, ID, skip);

      socket.emit(`load_oldest_messages`, {
        ...messages,
        userID: ID,
      });
    });

    socket.on(`read`, ({from, to}) => {
      messageStore.setReadStatus(from, to);
      socket.to(to).emit(`updateRead`, from);
    });

    // notify users upon disconnection
    socket.on(`disconnect`, async () => {
      const matchingSockets = await io.in(userID).allSockets();
      const isDisconnected = matchingSockets.size === 0;

      if (isDisconnected) {
        // notify other users
        const messagesPerUserKeys = messagesPerUser.keys();
        for (let i = 0; i < messagesPerUser.size; i++) {
          const key = messagesPerUserKeys.next().value;
          socket.to(key).emit(`user disconnected`, userID);
        }

        // update the connection status of the session
        sessionStore.saveSession(userID, {
          ...user,
          connected: false,
        });
      }
    });
  });
};
