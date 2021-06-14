import React from 'react';
import {Link} from 'react-router-dom';

import './project-sidebar.scss';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import {formatDate, getPluralNoun} from '../../utils/utils';
import UserAvatar from '../user-avatar';

type Props = {
  name: string,
  date: string,
  views: number,
  image: {
    buffer: string,
    extension: string,
  },
  expire: string,
  surname: string,
  username: string,
  isExpired: boolean,
  location?: {
    city: string,
    country: string,
  },
}

const ProjectSidebar: React.FC<Props> = (props) => {
  const {
    name, surname, username, location,
    image, views, date, expire, isExpired,
  } = props;
  const now = new Date();

  return (
    <Col lg={3} className="project__sidebar ps-lg-5">
      <Card>
        <Card.Header>Автор</Card.Header>
        <Card.Body>
          <Link
            to={`/user/${username}`}
            className="project__user-link"
          >
            <div className="d-flex align-items-center">
              <UserAvatar
                alt={username}
                className="me-2"
                buffer={image.buffer}
                extension={image.extension}
              />
              <span>
                {name} {surname} {
                  location &&
                    <><br/> {location.city}, {location.country}</>
                }
              </span>
            </div>
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
          <p>{getPluralNoun(views, [`перегляд`, `перегляди`, `переглядів`])}</p>
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
                Закриття <br/> {(new Date(expire)).toLocaleDateString()}
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
