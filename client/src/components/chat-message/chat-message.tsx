import React from 'react';
import {Link} from 'react-router-dom';

import './chat-message.scss';

import UserAvatar from '../user-avatar';

interface Props {
  message: {
    date: Date,
    name: string,
    image: {
      extension: string,
      buffer: string,
    },
    content: string,
    username: string,
    fromSelf: boolean,
    showAvatar: boolean,
  }
}

const ChatMessage: React.FC<Props> = ({message}) => {
  const {date, fromSelf, username, image, name, content, showAvatar} = message;

  const minutes = (date.getMinutes() < 10 ? `0` : ``) + date.getMinutes();
  const hours = (date.getHours() < 10 ? `0` : ``) + date.getHours();

  const formattedDate = `${hours}:${minutes}`;

  if (fromSelf) {
    return (
      <li className={`chat-right ${!showAvatar && `chat-right--without-image`}`}>
        <p className={`chat-text ${!showAvatar && `chat-text--spaced`}`}>
          {content}
          <small className="chat-time text-muted">{formattedDate}</small>
        </p>
        <Link className="chat-avatar" to={`/user/${username}`}>
          {
            showAvatar &&
            <>
              <UserAvatar
                alt={username}
                buffer={image.buffer}
                extension={image.extension}
              />
              <p className="chat-name">{name}</p>
            </>
          }
        </Link>
      </li>
    );
  }

  return (
    <li className={`chat-left ${!showAvatar && `chat-left--without-image`}`}>
      <Link className="chat-avatar" to={`/user/${username}`}>
        {
          showAvatar &&
            <>
              <UserAvatar
                alt={username}
                buffer={image.buffer}
                extension={image.extension}
              />
              <p className="chat-name">{name}</p>
            </>
        }
      </Link>
      <p className={`chat-text ${!showAvatar && `chat-text--spaced`}`}>
        {content}
        <small className="chat-time text-muted">{formattedDate}</small>
      </p>
    </li>
  );
};

export default ChatMessage;
