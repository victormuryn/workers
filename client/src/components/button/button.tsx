import React from 'react';
import './button.css';
import {Variants} from '../../types/types';

interface Props {
  variant?: Variants
  className?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const Button: React.FC<Props> = (props) => {
  const {
    children,
    className = ``,
    variant = `primary`,
    onClick = () => {},
  } = props;

  return (
    <button
      onClick={onClick}
      className={`button button--${variant} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
