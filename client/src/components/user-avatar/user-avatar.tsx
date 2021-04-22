import React from 'react';

import './user-avatar.scss';

type Props = {
  image: boolean,
  username: string,
  alt?: string,
  get?: string,
  width?: number,
  className?: string,
}

const UserAvatar: React.FC<Props> = (props) => {
  const {image, username, alt = username, width, className, get} = props;

  if (image) {
    return (
      <picture>
        <source
          type="image/webp"
          srcSet={`/img/users/${username}.webp${get ? `?${get}` : ``}`}
        />
        <source
          type="image/jpeg"
          srcSet={`/img/users/${username}.jpg${get ? `?${get}` : ``}`}
        />
        <img
          alt={alt}
          width={width}
          src={`/img/users/${username}.jpg${get ? `?${get}` : ``}`}
          className={`rounded-circle ${className}`}
        />
      </picture>
    );
  }

  return (
    <img
      alt={alt}
      width={width}
      src={`/img/default.svg${get ? `?${get}` : ``}`}
      className={`rounded-circle ${className}`}
    />
  );
};

export default UserAvatar;
