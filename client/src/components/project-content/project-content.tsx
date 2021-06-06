import React, {useState} from 'react';

import './project-content.scss';
import Badge from 'react-bootstrap/Badge';

import {formatPrice} from '../../utils/utils';
import {Link} from 'react-router-dom';
import EditBar from '../edit-bar';

interface Project {
  hot: boolean,
  title: string,
  price: number,
  remote: boolean,
  isOwner?: boolean,
  isExpired: boolean
  description: string,
  category: {
    _id: string,
    title: string,
    url: string,
  }[],
  location: {
    city: string,
    region: string,
    latitude: number,
    longitude: number,
  },
  onDelete: () => void,
}

const ProjectContent: React.FC<Project> = (props) => {
  const {
    title, price, description, isOwner = false,
    isExpired, hot, remote, location, category, onDelete,
  } = props;

  const [editing, setEditing] = useState<boolean>(false);

  return (
    <div className="project__content">
      {isExpired && <div className="project__expired" />}

      <h1 className="h2">{title}</h1>

      <h3 className="py-2">
        {
          !!price &&
            <Badge
              className="bg-success"
              variant="success">
              {formatPrice(price)}
            </Badge>
        }
        {` `}

        {
          hot &&
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

        {
          category.map(({_id, title, url}) => (
            <>
              <Badge
                key={_id}
                variant="info"
                className="bg-info">
                <Link
                  to={`/category/${url}`}
                  className="text-white text-decoration-none">
                  {title}
                </Link>
              </Badge>{` `}
            </>
          ))
        }
        {` `}

        {
          isExpired &&
            <Badge
              className="bg-secondary"
              variant="secondary">
              Час вийшов
            </Badge>
        }
      </h3>

      <hr/>
      <div dangerouslySetInnerHTML={{__html: description}}/>

      {
        isOwner && <EditBar
          onDelete={onDelete}
          onEdit={() => setEditing((prev) => !prev)}
          modalText={`Ви більше не зможете відновити цей проєкт.
          Усі ставки будуть втрачені.`}
          modalTitle="Ви дійсно хочете видалити проєкт?"
        />
      }
    </div>
  );
};

export default ProjectContent;
