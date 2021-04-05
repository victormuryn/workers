import React from 'react';

import './project-content.scss';
import Badge from 'react-bootstrap/Badge';

import {formatPrice} from '../../utils/utils';
import {Link} from 'react-router-dom';

type Project = {
  hot: boolean,
  title: string,
  price: number,
  isExpired: boolean
  remote: boolean,
  description: string,
  category: {
    title: string,
    url: string,
  },
  location: {
    city: string,
    region: string,
    latitude: number,
    longitude: number,
  },
}

const ProjectContent: React.FC<Project> = (props) => {
  const {
    title, price, description,
    isExpired, hot, remote, location, category,
  } = props;

  return (
    <div className="project__content">
      <h1 className="h2">{title}</h1>

      <h3 className="py-2">
        {!!price &&
          <Badge
            className="bg-success"
            variant="success">
            {formatPrice(price)}
          </Badge>
        }
        {` `}

        {hot &&
          <Badge
            className="bg-danger"
            variant="danger">
            Терміново
          </Badge>
        }
        {` `}

        <Badge
          className="bg-primary"
          variant="primary">
          {
            remote ?
              `Віддалено` :
              <a
                target="_blank"
                rel="noreferrer noopener"
                className="text-white text-decoration-none"
                href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
              >
                {location.city}, {location.region}
              </a>
          }
        </Badge>
        {` `}

        <Badge
          className="bg-info"
          variant="info">
          <Link
            to={`/category/${category.url}`}
            className="text-white text-decoration-none"
          >
            {category.title}
          </Link>
        </Badge>
        {` `}

        {isExpired &&
          <Badge
            className="bg-secondary"
            variant="secondary">
            Час вийшов
          </Badge>
        }
      </h3>

      <hr/>
      <div dangerouslySetInnerHTML={{__html: description}}/>
    </div>
  );
};

export default ProjectContent;
