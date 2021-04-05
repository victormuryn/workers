import React from 'react';

import './user-social-item.scss';

import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

type SocialItemProps = {
  title: `github` | `website` | `facebook` | `instagram` | `twitter`,
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  value: string | undefined,
  editable: boolean,
};

const UserSocialItem: React.FC<SocialItemProps> = (props) => {
  const {title, value, editable, onInputChange} = props;

  const titleToUrl = {
    github: `https://github.com/`,
    website: `https://workers.com/`,
    twitter: `https://twitter.com/`,
    facebook: `https://www.facebook.com/`,
    instagram: `https://www.instagram.com/`,
  };

  const transformTitle = {
    github: `Github`,
    website: `Веб-сайт`,
    facebook: `Facebook`,
    instagram: `Instagram`,
    twitter: `Twitter`,
  };

  let name = value;
  let pattern = `https://.*`;
  let placeholder = titleToUrl[title];

  if (!editable && typeof value === `string` && title !== `website`) {
    const parts = value.split(`/`);
    name = parts[parts.length - 1];
  }

  if (editable && title !== `website`) {
    pattern = titleToUrl[title] + `.*`;
    placeholder += `username`;
  }

  const icon = (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width={24}
        height={24} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round"
        className="feather mr-2 icon-inline">
        <use href={`#icon-${title}`}/>
      </svg> {transformTitle[title]}
    </>
  );

  const label = value ?
    <a
      target="_blank"
      rel="noreferrer nooopener"
      href={value}
      className="mb-0 h6 text-body text-decoration-none">
      {icon}
    </a> :
    <span className="mb-0 h6 text-body text-decoration-none">
      {icon}
    </span>;

  return (
    <ListGroup.Item as={`li`} className="d-flex
      justify-content-between align-items-center flex-wrap">
      {label}

      {
        editable ?
          <Form.Control
            type="url"
            value={value}
            pattern={pattern}
            className="w-auto"
            onChange={onInputChange}
            placeholder={placeholder}
            name={`user.social.${title}`}
          /> :
          <span className="text-secondary">{name}</span>
      }
    </ListGroup.Item>
  );
};

export default UserSocialItem;
