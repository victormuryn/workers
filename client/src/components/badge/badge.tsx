import React from 'react';
import './badge.css';

import {Variants} from '../../types/types';

interface Props {
  variant?: Variants
  className?: string
}

const Badge: React.FC<Props> = (props) => {
  const {children, variant = `primary`, className = ``} = props;

  return (
    <span className={`badge badge--${variant} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
