import React, {useCallback, useEffect, useState} from 'react';
import './dropdown.css';
import {NavLink} from 'react-router-dom';

interface DropdownProps {
  title: React.ReactNode
  expanded?: boolean
}

interface ItemProps {
  to?: string
  className?: string
  onClick?: React.MouseEventHandler
}

interface Dropdown extends React.FC<DropdownProps> {
  Item: React.FC<ItemProps>,
  Divider: React.FC,
}

const Dropdown: Dropdown = (props) => {
  const {title, children, expanded = false} = props;
  const [show, setShow] = useState<boolean>(expanded);

  const clickHandler = useCallback(() => setShow(false), []);

  useEffect(() => {
    if (show) {
      document.addEventListener(`click`, clickHandler);
    } else {
      document.removeEventListener(`click`, clickHandler);
    }
  }, [show, clickHandler]);

  return (
    <div className={`dropdown ${show && `dropdown--open`}`}>
      <button
        className="dropdown__button"
        onClick={() => setShow((prev) => !prev)}
      >
        {title}
      </button>

      <ul className="dropdown__pop-up">{children}</ul>
    </div>
  );
};

const Item: React.FC<ItemProps> = (props) => {
  const {children, to, onClick = () => {}, className = ``} = props;

  const data = {
    onClick,
    className: `dropdown__item ${className}`,
  };

  if (to) {
    return (
      <li>
        <NavLink
          {...data}
          to={to}
          activeClassName="active"
        >{children}</NavLink>
      </li>
    );
  }

  return (
    <li><button {...data}>{children}</button></li>
  );
};

const Divider: React.FC = () => {
  return (<hr className="dropdown__divider" />);
};

Dropdown.Item = Item;
Dropdown.Divider = Divider;

export default Dropdown;
