import React from 'react';

import './activity-item.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Link} from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

type Props = {
  id: string,
  hot: boolean,
  title: string,
  price?: number,
  category: {
    _id: string,
    title: string
  }[],
  remote: boolean,
  location: {
    city: string,
    region: string,
  },
  date: string | Date,
};

const ActivityItem: React.FC<Props> = (props) => {
  const {
    hot, id, title, category, remote,
    location, price, date, children,
  } = props;

  return (
    <li className="projects__item">
      <Row className={`align-items-center ${hot && `projects__item--hot`}`}>
        <Col md={{
          offset: 1,
          span: 5,
        }}>
          <Link
            to={`/project/${id}`}
            className="project__item-link"
          >
            <span className={`h4 ${hot && `text-danger`}`}>{title}</span>
            <p className="small text-muted mt-2 mb-md-0">
              {category.map(({title}) => `${title}, `)}
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
              <Tooltip id={`price-${id}`}>
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

        <Col md={2} className="d-flex justify-content-center">
          {children}
        </Col>

        <Col md={1}>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`date-${id}`}>
                Дата публікації
              </Tooltip>
            }
          >

            <p className="project__item-text m-md-0">
              {new Date(date).toLocaleDateString()}
            </p>
          </OverlayTrigger>
        </Col>
      </Row>
    </li>
  );
};

export default ActivityItem;
