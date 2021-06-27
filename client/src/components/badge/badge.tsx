import React from 'react';
import './badge.css';

import {Variants} from '../../types/types';

interface Props {
  variant?: Variants
  className?: string
  as?: React.ElementType
}

const Badge: React.FC<Props> = (props) => {
  const {children, variant = `primary`, className = ``, as = 'span'} = props;
  const Component = as;

  return (
    <Component className={`badge badge--${variant} ${className}`}>
      {children}
    </Component>
  );
};

export default Badge;
