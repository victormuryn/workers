import React, {useState} from 'react';
import {Link} from 'react-router-dom';

import './user-rating-item.scss';

import Tooltip from 'react-bootstrap/Tooltip';
import ProgressBar from 'react-bootstrap/ProgressBar';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import InputAutocomplete from '../input-autocomplete';
import api from '../../utils/api';
import {ActionMeta, OptionsType} from 'react-select';
import {Simulate} from "react-dom/test-utils";

type Suggestion = {
  value: string | number,
  label: string,
  group?: string,
};

type Category = {
  _id: string,
  url: string,
  title: string,
  group: string,
};

type Props = {
  id: string,
  all: number,
  url: string,
  title: string,
  place: number,
  isOwner: boolean,
  onCategoryChange: (id?: string) => void,
}

const UserRatingItem: React.FC<Props> = ({
  id,
  all,
  url,
  title,
  place,
  isOwner,
  onCategoryChange,
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [value, setValue] = useState<string>(title);
  const [loading, setLoading] = useState<boolean>(false);

  const inputChangeHandler = (value: string, {action}: {
    action: 'set-value' | 'input-change' | 'input-blur' | 'menu-close',
  }) => {
    if (action !== `input-change`) {
      return;
    }

    setValue(value);

    if (!value) {
      setSuggestions([]);
      onCategoryChange();
      return;
    }

    setLoading(true);
    api
      .get<Category[]>(`/categories/autofill/${value}`)
      .then(({data}) => {
        const result = data.map(({_id: value, title: label, group}) => ({
          group, label, value,
        }));

        setSuggestions(result);
        setLoading(false);
      });
  };

  const selectChangeHandler = (
    data: Suggestion | OptionsType<Suggestion> | null,
    options: ActionMeta<Suggestion>,
  ) => {
    if (options.action === `clear`) {
      onCategoryChange();
      setValue(``);
      setSuggestions([]);
      return;
    }

    if (!data || Array.isArray(data)) return;

    // we could do this 'cause OptionsType<Suggestion> == Suggestion[]
    const d = data as Suggestion;
    onCategoryChange(d.value.toString());

    setSuggestions([]);
    setValue(d.label);
  };

  return (
    <>
      <p className="text-center my-0">
        {
          isOwner ?
            <InputAutocomplete
              loading={loading}
              className="text-center"
              suggestions={suggestions}
              placeholder="Виберіть категорію"
              value={{label: value, value: id}}
              onInputChange={inputChangeHandler}
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
