import React from 'react';

import './user-rating.scss';

import Card from 'react-bootstrap/Card';
import ProgressBar from 'react-bootstrap/ProgressBar';

import UserRatingItem from '../user-rating-item';

type Props = {
  isOwner: boolean,
  categories: Array<{
    all: number,
    place: number,
    title: string,
    url: string,
    id: string,
  }>,
  rating: {
    all: number,
    place: number,
  },
  onCategoryChange: (newId: string | undefined, currentId: string) => void,
}

const UserRating: React.FC<Props> = ({
  rating,
  categories,
  isOwner,
  onCategoryChange,
}) => {
  if (isOwner) {
    for (let i = 0; i < 2; i++) {
      if (!categories[i]) {
        categories[i] = {
          all: 1,
          place: 1,
          title: ``,
          url: ``,
          id: ``,
        };

        break;
      }
    }
  }

  return (
    <Card className="mt-3" as="section">
      <Card.Body>
        <h5 className="mb-3">Рейтинг</h5>

        <p className="text-center my-0">
          Загальний рейтинг ({rating.place} / {rating.all})
        </p>
        <ProgressBar
          max={1}
          animated
          min={rating.all}
          now={rating.place}
          className="mb-3 mt-2"
        />

        {
          categories.map(({title, all, place, url, id}, i) =>
            <UserRatingItem
              key={id + i}
              all={all}
              url={url}
              title={title}
              place={place}
              isOwner={isOwner}
              onCategoryChange={(newId) => onCategoryChange(newId, id)}
            />,
          )
        }
      </Card.Body>
    </Card>
  );
};

export default UserRating;
