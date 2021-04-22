import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useHttp} from '../../hooks/http.hook';

import './user-rating-item.scss';

import Tooltip from 'react-bootstrap/Tooltip';
import ProgressBar from 'react-bootstrap/ProgressBar';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import InputAutocomplete from '../input-autocomplete';

type Suggestions = Array<{
  value: string,
  text: string,
  group?: string,
}>;

type Response = Array<{
  _id: string,
  title: string,
  url: string,
  group?: string,
}>;

type Props = {
  all: number,
  url: string,
  title: string,
  place: number,
  isOwner: boolean,
  onCategoryChange: (id?: string) => void,
}

const UserRatingItem: React.FC<Props> = ({
  all,
  url,
  title,
  place,
  isOwner,
  onCategoryChange,
}) => {
  const [suggestions, setSuggestions] = useState<Suggestions>([]);
  const [value, setValue] = useState<string>(title);
  const {request} = useHttp<Response>();

  const inputChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const {value} = e.target;
    setValue(value);

    const data = await request(`/api/categories/autofill/${value}`, `GET`);
    const result = data.map(({_id, title: text, group}) => ({
      text,
      group,
      value: `${_id}|${title}`,
    }));

    setSuggestions(result);
  };

  const selectChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const {value} = e.target;
    const [id, title] = value.split(`|`);

    onCategoryChange(id);

    setSuggestions([]);
    setValue(title);
  };

  return (
    <>
      <p className="text-center my-0">
        {
          isOwner ?
            <InputAutocomplete
              value={value}
              className="text-center"
              suggestions={suggestions}
              placeholder="Виберіть категорію"
              inputName={`rating-input-${url}`}
              onInputChange={inputChangeHandler}
              selectName={`rating-select-${url}`}
              onSelectChange={selectChangeHandler}
            /> :
            <>
              <Link
                to={`/category/${url}`}
                className="text-decoration-none"
              >{title}</Link> ({place} / {all})
            </>
        }
      </p>

      {
        isOwner ?
          <OverlayTrigger
            key={value}
            placement="top"
            overlay={
              <Tooltip id={value}>
                {place} місце з {all}
              </Tooltip>
            }
          >
            <ProgressBar
              max={1}
              animated
              now={place}
              className="mb-3 mt-2"
              min={all <= 1 ? 2 : all}
            />
          </OverlayTrigger> :
          <ProgressBar
            max={1}
            animated
            now={place}
            className="mb-3 mt-2"
            min={all <= 1 ? 2 : all}
          />
      }
    </>
  );
};

export default UserRatingItem;
