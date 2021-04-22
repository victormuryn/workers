import Chat, {ChatType} from '../../models/Chat';
import {LeanDocument} from 'mongoose';

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
    cb: (error: undefined | Error, messages: LeanDocument<ChatType>[]) => any,
  ) {}
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
   * @return {Message[]}
   */
  async findMessagesForUser(
    userID: string,
    cb: (error: undefined | Error, messages: LeanDocument<ChatType>[]) => any,
  ) {
    try {
      const to = await Chat.find({to: userID}).lean();
      const from = await Chat.find({from: userID}).lean();

      const result = [...to, ...from].sort((a, b) => {
        return +(new Date(a.date)) - +(new Date(b.date));
      });

      if (cb) cb(undefined, result);
      return result;
    } catch (error) {
      if (cb) cb(error, []);
      throw new Error(error);
    }
  }
}
