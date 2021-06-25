import React from 'react';
import {Link} from 'react-router-dom';

import './project-item.css';

import {formatDate, formatPrice} from '../../utils/utils';
import Badge from '../badge';
import Button from "../button";

type ProjectItemProps = {
  _id: string,
  hot: boolean,
  date: string,
  price?: number,
  title: string,
  remote: boolean,
  isEven?: boolean,
  description?: string,
  location: {
    city: string,
    region: string,
  },
  category: {
    _id: string,
    title: string,
  }[],
};

const ProjectItem: React.FC<ProjectItemProps> = (props) => {
  const {
    _id, title, price, date, hot, description,
    remote, location, category,
  } = props;

  const now = new Date();

  // less than day
  const isNew = +now - (+new Date(date)) < 1000 * 60 * 60 * 24;

  return (
    <li className={`project__item ${hot && `project__item--hot`}`}>
      <Link to={`/project/${_id}`} className="project__item-link">
        <h3 className="project__item-title">{title}</h3>

        <p className="project__item-date">
          {isNew && <Badge variant="secondary">Новий</Badge>}
          {hot && <Badge variant="danger">Терміново</Badge>}
          Опубліковано {formatDate(date)} тому
        </p>

        <div className="project__data">
          <div className="project__data-item">
            <h5 className="project__data-item-title">Локація</h5>
            <p className="project__data-item-text">
              {
                remote ?
                  `Віддалено` :
                  `${location.city}, ${location.region}`
              }
            </p>
          </div>

          {
            price ?
              <div className="project__data-item">
                <h5 className="project__data-item-title">Ціна</h5>
                <p className="project__data-item-text">{formatPrice(price)}</p>
              </div> : null
          }
        </div>

        <p className="project__description">{description}...</p>

        <ul className="project__categories-list">
          {
            category.map(({_id, title}) => (
              <li key={_id}><Badge>{title}</Badge></li>
            ))
          }
        </ul>
      </Link>
    </li>
  );
};

export default ProjectItem;
