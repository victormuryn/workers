import Chat, {ChatType} from '../../models/Chat';
import {Types} from 'mongoose';

interface MessagesParameter {
  more: boolean,
  messages: ChatType[],
}

/**
 * Message Store abstract class
 */
class MessageStore {
  /**
   * save message in store
   * @param {Message} message - Message
   */
  saveMessage(message: ChatType) {}

  /**
   * find messages
   * @param {string} userID - User ID
   * @param {function} cb - callback
   */
  findMessagesForUser(
    userID: string,
    cb: (error: undefined | Error, messages: MessagesParameter[]) => any,
  ) {}

  /**
   * Get messages between two users
   * @param {string} first - first user id
   * @param {string} second - second user id
   * @param {number} offset = 0
   * @param {number} limit = 50
   */
  getMessagesForUsers(
    first: string,
    second: string,
    offset = 0,
    limit = 50,
  ) {}

  /**
   * Set that all messages have been read
   * @param {string} from
   * @param {string} to
   */
  setReadStatus(from: string, to: string) {}
}

/**
 * Message store. Here will be saved all messages
 */
export default class DBMessageStore extends MessageStore {
  /**
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Save message in store
   * @param {ChatType} message - Message
   */
  async saveMessage(message: ChatType) {
    await new Chat(message).save();
  }

  /**
   * Find all messages from user or sent by user
   * @param {string} userID - User ID
   * @param {function} cb - callback
   * @return {ChatType[]}
   */
  async findMessagesForUser(
    userID: string,
    cb: (error: undefined | Error, messages: MessagesParameter[]) => any,
  ) {
    try {
      const mongoUserID = new Types.ObjectId(userID);

      const users = await Chat.aggregate([
        {$match: {$or: [{to: mongoUserID}, {from: mongoUserID}]}},
        {
          $group: {
            _id: null,
            from: {$addToSet: '$from'},
            to: {$addToSet: '$to'},
          },
        },
        {
          $project: {
            _id: 0,
            usersList: {
              $filter: {
                input: {$setUnion: ['$from', '$to']},
                cond: {$ne: ['$$this', mongoUserID]},
              },
            },
          },
        },
      ]).exec();

      const result: MessagesParameter[] = [];
      if (users?.[0]?.usersList) {
        const {usersList} = users[0];

        for (let i = 0; i < usersList.length || 0; i++) {
          const id = usersList[i];
          const data = await this.getMessagesForUsers(userID, id);

          result.push(data);
        }
      }


      if (cb) cb(undefined, result);
      return result;
    } catch (error) {
      if (cb) cb(error, []);
      throw new Error(error);
    }
  }

  /**
   * Get messages between two users
   * @param {string} first - first user id
   * @param {string} second - second user id
   * @param {number} offset = 0
   * @param {number} limit = 20
   * @return {{messages: ChatType[], more: boolean}}
   */
  async getMessagesForUsers(
    first: string,
    second: string,
    offset = 0,
    limit = 20,
  ) {
    const filter = {
      '$or': [
        {to: first, from: second},
        {to: second, from: first},
      ],
    };

    const messages = await Chat
      .find(filter)
      .sort(`-date`)
      .skip(offset)
      .limit(limit)
      .lean();

    const count = await Chat.countDocuments(filter);
    const more = count > offset + limit;

    return {
      more,
      messages: messages.reverse(),
    };
  }

  /**
   * Set that all messages have been read
   * @param {string} from
   * @param {string} to
   */
  async setReadStatus(from: string, to: string) {
    const messages = await Chat.find({
      '$or': [{from, to, read: false}, {from: to, to: from, read: false}],
    });

    messages.forEach((message) => {
      message.read = true;
      message.save();
    });
  }

  /**
   * Is there any messages between users
   * @param {string} currentUserID - first user
   * @param {string} otherUserID - second user
   * @return {boolean}
   */
  async isMessagesBetweenUsers(currentUserID: string, otherUserID: string) {
    const messagesBetweenUsers = await Chat.countDocuments({
      '$or': [{
        from: currentUserID,
        to: otherUserID,
      }, {
        from: otherUserID,
        to: currentUserID,
      }],
    });

    return !!messagesBetweenUsers;
  }
}
