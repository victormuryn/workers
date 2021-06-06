import React from 'react';

import './chat-user-top-panel.scss';
import {Link} from 'react-router-dom';

interface Props {
  name?: string,
  surname?: string,
  username?: string,
}

const ChatUserTopPanel: React.FC<Props> = ({
  name = ``,
  surname = ``,
  username = ``,
}) => {
  return (
    <div className="selected-user">
      <span>Кому: <Link
        to={`/user/${username}`}
        className="name text-dark text-decoration-none fw-bold">
        {name} {surname}
      </Link>
      </span>
    </div>
  );
};

export default React.memo(ChatUserTopPanel);
