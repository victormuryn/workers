import React from 'react';
import {Link} from 'react-router-dom';

import './chat-message.scss';

import UserAvatar from '../user-avatar';

interface Props {
  message: {
    date: Date,
    name: string,
    image: boolean,
    content: string,
    username: string,
    fromSelf: boolean,
    showAvatar: boolean,
  }
}

const ChatMessage: React.FC<Props> = ({message}) => {
  const {date, fromSelf, username, image, name, content, showAvatar} = message;

  return (
    <li className={
      `chat-${fromSelf ? `right` : `left`} ${!showAvatar && `mb-3`}`
    }>
      {
        showAvatar &&
          <Link className="chat-avatar" to={`/user/${username}`}>
            <UserAvatar
              width={48}
              image={image}
              username={username}
            />
            <p className="chat-name">{name}</p>
          </Link>
      }
      <p className={`chat-text ${!showAvatar && `chat-text--spaced`}`}>
        {content}
      </p>
      <p className="chat-hour">
        {date.toLocaleTimeString()}
        {` `}|{` `}
        {date.toLocaleDateString()}
      </p>
    </li>
  );
};

export default ChatMessage;
