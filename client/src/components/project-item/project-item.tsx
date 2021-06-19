import React from 'react';
import {Link} from 'react-router-dom';

import './project-item.scss';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

type ProjectItemProps = {
  _id: string,
  hot: boolean,
  date: string,
  price?: number,
  title: string,
  remote: boolean,
  isEven?: boolean,
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
    _id, title, price, date, children, hot,
    remote, location, category, isEven = false,
  } = props;

  const now = new Date();
  const months = [`січня`, `лютого`, `березня`, `квітня`, `травня`, `червня`,
    `липня`, `серпня`, `вересня`, `жовтня`, `листопада`, `грудня`];

  const formatDate = (projectDate: string) => {
    const date = new Date(projectDate);

    const setZero = (number: number): string => {
      return number < 10 ? `0${number}` : number.toString();
    };

    const day = setZero(date.getDate());
    const hours = setZero(date.getHours());
    const minutes = setZero(date.getMinutes());

    return date.getDate() === now.getDate() ?
      `${hours}:${minutes}` :
      `${day} ${months[date.getMonth()]}`;
  };

  return (
    <li
      className={`projects__item`}
      style={{backgroundColor: isEven ? `#F5F5F5` : ``}}
    >
      <Row className={`align-items-center ${hot && `projects__item--hot`}`}>
        <Col md={{offset: 1, span: 6}} className="px-4">
          <Link
            to={`/project/${_id}`}
            className="project__item-link"
          >
            <span className={`h4 ${hot && `text-danger`}`}>{title}</span>
            <p className="small text-muted mt-2 mb-0">
              {category.map(({title}) => `${title}, `)}
              {
                remote ?
                  <>віддалено</> :
                  <>{location.city}, {location.region}</>
              }
            </p>
          </Link>
        </Col>

        {/* price */}
        <Col className="d-none d-md-block" md={1}>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`price-${_id}`}>Ціна</Tooltip>}
          >
            <p className="project__item-text text-success fw-bold m-md-0">
              {
                price ?
                  `${new Intl.NumberFormat(`uk`, {
                    style: 'currency',
                    currency: 'UAH',
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(price)}` :
                  null
              }
            </p>
          </OverlayTrigger>
        </Col>

        {/* bets count */}
        <Col md={2} className="d-none d-md-flex justify-content-center">
          {children}
        </Col>

        {/* expire date */}
        <Col className="d-none d-md-block" md={1}>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`date-${_id}`}>Дата публікації</Tooltip>}
          >
            <p className="project__item-text m-md-0">{formatDate(date)}</p>
          </OverlayTrigger>
        </Col>
      </Row>
    </li>
  );
};

export default ProjectItem;
