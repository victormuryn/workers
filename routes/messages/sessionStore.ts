export interface Session {
  name: string,
  image: {
    extension: string,
    buffer: string,
  },
  userID: string,
  surname: string,
  username: string,
  connected: boolean,
}

/**
 * SessionStore class default
 */
class SessionStore {
  /**
   * findSession placeholder
   * @param {string} id
   */
  findSession(id: string) {}
  /**
   * saveSession placeholder
   * @param {string} id
   * @param {Session} session
   */
  saveSession(id: string, session: Session) {}

  /**
   * findAllSessions placeholder
   */
  findAllSessions() {}
}

/**
 *  Session store. Here will be saved all users
 */
export default class InMemorySessionStore extends SessionStore {
  private sessions: Map<any, any>;
  /**
   * Constructor for SessionStore
   * @constructor
   */
  constructor() {
    super();
    this.sessions = new Map();
  }

  /**
   * Searching for session with current id
   * @param {string} id - Session ID.
   * @return {Session} - returns session.
   */
  findSession(id: string) {
    return this.sessions.get(id);
  }

  /**
   * Save session in storage
   * @param {string} id - Session id.
   * @param {Session} session - Session.
   */
  saveSession(id: string, session: Session) {
    this.sessions.set(id, session);
  }

  /**
   * Get all sessions
   * @return {Session[]} - All sessions array
   */
  findAllSessions() {
    return [...this.sessions.values()];
  }
}
