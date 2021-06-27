import React from 'react';
import './button.css';
import {Variants} from '../../types/types';

interface Props {
  variant?: Variants
  className?: string
  as?: React.ElementType
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  [key: string]: any,
}

const Button: React.FC<Props> = (props) => {
  const {
    children,
    as = `button`,
    className = ``,
    variant = `primary`,
    onClick = () => {},
  } = props;

  const Component = as;

  const properties = {...props};
  delete properties.as;
  delete properties.className;
  delete properties.children;
  delete properties.variant;
  delete properties.onClick;

  return (
    <Component
      {...properties}
      tabIndex={0}
      onClick={onClick}
      className={`button button--${variant} ${className}`}
    >
      {children}
    </Component>
  );
};

export default Button;
