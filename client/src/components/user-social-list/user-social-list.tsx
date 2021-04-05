import React from 'react';

import './user-social-list.scss';
import {ListGroup} from 'react-bootstrap';
import UserSocialItem from '../user-social-item';

type SocialListProps = {
  editable: boolean,
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  social: {
    twitter?: string,
    instagram?: string,
    facebook?: string,
    website?: string,
    github?: string,
  }
};

const UserSocialList: React.FC<SocialListProps> = (props) => {
  const {editable, social, onInputChange} = props;
  const data = Object.keys(social) as Array<keyof typeof social>;

  return (
    <ListGroup as={`ul`} variant="flush">
      {data.map((name) => {
        return social[name] || editable ? <UserSocialItem
          key={name}
          title={name}
          editable={editable}
          value={social[name]}
          onInputChange={onInputChange}
        /> : null;
      })}
    </ListGroup>
  );
};

export default UserSocialList;
