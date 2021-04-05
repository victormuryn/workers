import React from 'react';
import {Link} from 'react-router-dom';

import './project-sidebar.scss';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import {formatDate, getPluralNoun} from '../../utils/utils';

type Props = {
  name: string,
  date: string,
  views: number,
  image: boolean,
  expire: string,
  surname: string,
  username: string,
  isExpired: boolean,
  location: {
    city: string,
    country: string,
  },
  // category: {
  //   title: string,
  //   url: string,
  // }
}

const ProjectSidebar: React.FC<Props> = (props) => {
  const {
    name, surname, username, location,
    image, views, date, expire, isExpired,
  } = props;
  const now = new Date();

  return (
    <Col lg={3} className="project__sidebar ps-5">
      <Card>
        <Card.Header>Автор</Card.Header>
        <Card.Body>
          <Link
            to={`/user/${username}`}
            className="project__user-link"
          >
            <Row className="align-items-center">
              <Col sm={3}>
                {
                  image ?
                    <picture>
                      <source
                        srcSet={`/img/users/${username}.webp`}
                        type="image/webp"
                      />

                      <source
                        srcSet={`/img/users/${username}.jpg`}
                        type="image/jpeg"
                      />

                      <img
                        alt={username}
                        src={`/img/users/${username}.jpg`}
                        className="rounded-circle"
                      />
                    </picture> :
                    <img
                      alt={username}
                      src="/img/default.svg"
                      className="rounded-circle"
                    />
                }
              </Col>
              <Col>
                <span>
                  {name} {surname} { location.city &&
                    <>
                      <br/>
                      {location.city}, {location.country}</>
                  }
                </span>
              </Col>
            </Row>
          </Link>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>Інформація</Card.Header>
        <Card.Body>
          <OverlayTrigger
            placement="top-start"
            overlay={
              <Tooltip id="published">
                Опубліковано <br/>
                {(new Date(date)).toLocaleDateString()}
              </Tooltip>
            }
          >
            <p>{formatDate(date, now)} тому</p>
          </OverlayTrigger>
          <p>{views} {getPluralNoun(
            views,
            `перегляд`,
            `перегляди`,
            `переглядів`,
          )}</p>
        </Card.Body>
      </Card>

      {!isExpired &&
      <Card>
        <Card.Header>До закриття</Card.Header>
        <Card.Body>
          <OverlayTrigger
            placement="top-start"
            overlay={
              <Tooltip id="expires">
                Закриття <br/>
                {(new Date(expire)).toLocaleDateString()}
              </Tooltip>
            }
          >
            <p>{formatDate(expire, now)}</p>
          </OverlayTrigger>
        </Card.Body>
      </Card>
      }
    </Col>
  );
};

export default ProjectSidebar;
