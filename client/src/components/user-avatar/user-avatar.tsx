import React from 'react';

import './user-avatar.scss';

type Props = {
  alt?: string,
  width?: number,
  className?: string,
  buffer?: string,
  extension?: string
}

const UserAvatar: React.FC<Props> = (props) => {
  const {alt, width, className, buffer, extension} = props;

  if (buffer && extension) {
    return (
      <picture>
        {/* <source*/}
        {/*  type="image/webp"*/}
        {/*  srcSet={`/img/users/${username}.webp${get ? `?${get}` : ``}`}*/}
        {/* />*/}
        {/* <source*/}
        {/*  type="image/jpeg"*/}
        {/*  srcSet={`/img/users/${username}.jpg${get ? `?${get}` : ``}`}*/}
        {/* />*/}
        <img
          alt={alt}
          width={width}
          src={`data:image/${extension};base64,${buffer}`}
          className={`rounded-circle ${className}`}
        />
      </picture>
    );
  }

  return (
    <img
      alt={alt}
      width={width}
      src="/img/default.svg"
      className={`rounded-circle ${className}`}
    />
  );
};

export default UserAvatar;
