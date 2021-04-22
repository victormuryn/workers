import React from 'react';
import {Link} from 'react-router-dom';

import './project-item.scss';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import {Bet} from "../../types/types";

type ProjectItemProps = {
  bets: Bet[],
  _id: string,
  hot: boolean,
  date: string,
  price: number,
  title: string,
  remote: boolean,
  location: {
    city: string,
    region: string,
    latitude: number,
    longitude: number,
  },
  category: {
    title: string,
    url: string,
  }
};

const ProjectItem: React.FC<ProjectItemProps> = (props) => {
  const {
    _id, title, price, date, bets, hot,
    remote, location, category,
  } = props;

  const now = new Date();
  const months = [`січня`, `лютого`, `березня`, `квітня`, `травня`, `червня`,
    `липня`, `серпня`, `вересня`, `жовтня`, `листопада`, `грудня`];

  const formatDate = (projectDate: string): string => {
    const date = new Date(projectDate);

    const setZero = (number: number): string => {
      return number < 10 ? `0${number}` : number.toString();
    };

    const day: string = setZero(date.getDate());
    const hours: string = setZero(date.getHours());
    const minutes: string = setZero(date.getMinutes());

    return date.getDate() === now.getDate() ?
      `${hours}:${minutes}` :
      `${day} ${months[date.getMonth()]}`;
  };

  return (
    <li className="projects__item">
      <Row className={`align-items-center ${hot && `projects__item--hot`}`}>
        <Col md={{
          offset: 1,
          span: 7,
        }}>
          <Link
            to={`/project/${_id}`}
            className="project__item-link"
          >
            <span className={`h4 ${hot && `text-danger`}`}>{title}</span>
            <p className="small text-muted mt-2 mb-md-0">
              {category.title},{` `}
              {
                remote ?
                  <>віддалено</> :
                  <>{location.city}, {location.region}</>
              }
            </p>
          </Link>
        </Col>

        <Col md={1}>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`price-${_id}`}>
                Ціна
              </Tooltip>
            }
          >
            <p className="project__item-text text-success fw-bold m-md-0">
              {price ?
                `${new Intl.NumberFormat(`uk`, {
                  style: 'currency',
                  currency: 'UAH',
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                }).format(price)}` :
                null}
            </p>
          </OverlayTrigger>
        </Col>

        <Col md={1}>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`count-${_id}`}>
                Кількість ставок
              </Tooltip>
            }
          >
            <p className="project__item-text text-danger m-md-0">
              {bets.length}
            </p>
          </OverlayTrigger>
        </Col>

        <Col md={1}>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`date-${_id}`}>
                Дата публікації
              </Tooltip>
            }
          >

            <p className="project__item-text m-md-0">
              {formatDate(date)}
            </p>
          </OverlayTrigger>
        </Col>
      </Row>
    </li>
  );
};

export default ProjectItem;
