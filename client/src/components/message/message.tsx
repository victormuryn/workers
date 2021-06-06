import React from 'react';

import './message.scss';

type MessageProps = {
  text: string,
  onClose?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  type?: `info` | `danger` | `warning` | `success`
};

const Message: React.FC<MessageProps> = ({
  text,
  onClose = () => {},
  type = `info`,
}) => {
  return (
    <div className="msg-container">
      <div className={`xd-message msg-${type}`}>
        <div className="xd-message-icon">
          <svg viewBox="0 0 30 10" xmlns="http://www.w3.org/2000/svg">
            <use href={`#icon-${type}`} className="ion-alert" />
          </svg>
        </div>
        <div className="xd-message-content">
          <p>{text}</p>
        </div>
        <a href="#" className="xd-message-close" onClick={onClose}>
          <svg viewBox="0 0 30 10" xmlns="http://www.w3.org/2000/svg">
            <use href={`#icon-danger`} className="close-icon" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default Message;
