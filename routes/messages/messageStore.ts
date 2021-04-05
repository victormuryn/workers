export interface Message {
  to: string,
  from: string,
  content: string,
}

/**
 * Message Store abstract class
 */
class MessageStore {
  /**
   * save message in store
   * @param {Message} message - Message
   */
  saveMessage(message: Message) {}

  /**
   * find messages
   * @param {string} userID - User ID
   */
  findMessagesForUser(userID: string) {}
}

/**
 * Message store. Here will be saved all messages
 */
export default class InMemoryMessageStore extends MessageStore {
  private messages: Message[];

  /**
   * @constructor
   */
  constructor() {
    super();
    this.messages = [];
  }

  /**
   * Save message in store
   * @param {Message} message - Message
   */
  saveMessage(message: Message) {
    this.messages.push(message);
  }

  /**
   * Find all messages from user or sent by user
   * @param {string} userID - User ID
   * @return {Message[]}
   */
  findMessagesForUser(userID: string) {
    return this.messages.filter(({from, to}) => [from, to].includes(userID));
  }
}
