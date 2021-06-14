import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';

import './bet-item.scss';

import Badge from 'react-bootstrap/Badge';

import EditBar from '../edit-bar';
import UserAvatar from '../user-avatar';
import ProjectBetEditor from '../project-bet-editor';

import {State} from '../../redux/reducer';
import {formatPrice, getPluralNoun} from '../../utils/utils';
import Message from '../message';
import {Bet, MinUser} from '../../types/types';
import api from '../../utils/api';

type Props = {
  _id: string,
  text: string,
  term: number,
  date: string,
  price: number,
  author: MinUser,
  onDeleteClick: (e: React.MouseEvent) => void,
  updated: {
    count: number,
    lastDate?: string,
  }
};

interface BetData {
  price: number,
  text: string,
  term: number,
  updated: number,
}

const BetItem: React.FC<Props> = (props) => {
  const {_id, text, price, term, date, onDeleteClick, updated, author} = props;
  const user = useSelector((state: State) => state.user);

  const [editError, setEditError] = useState<string>(``);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [data, setData] = useState<BetData>({
    price, term, text,
    updated: updated.count,
  });

  const htmlText = data
    .text
    .split(`\n`)
    .filter((i) => i)
    .map((i) => `<p>${i}</p>`)
    .join(`\n`);

  const editInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const editSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    api
      .patch<{
        message: string,
        bet: Bet
      }>(`/bet/${_id}`, {...data, date: new Date()}, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      })
      .then(({data}) => data)
      .catch(({response}) => {
        setEditError(response.data.message);
        return response.data;
      })
      .then((data) => {
        setShowEdit(false);

        const {text, price, term, updated} = data.bet;
        setData({text, price, term, updated: updated.count});
      });
  };

  return (
    <>
      {
        editError &&
          <Message
            type="danger"
            text={editError}
            onClose={() => {
              setEditError(``);
              setShowEdit(false);
            }}
          />
      }
      <article className="project__content project__bet p-4">
        <div className="bet__author-line d-flex align-content-center">
          <Link to={`/user/${author.username}`} className="project__user-link">
            <UserAvatar
              alt={author.username}
              buffer={author.image.buffer}
              extension={author.image.extension}
            /> {author.name} {author.surname}
          </Link>

          <div className="ms-auto me-2 bet__badge-wrapper">
            <Badge
              className="bg-primary"
              variant="primary">
              {getPluralNoun(data.term, [`день`, `дні`, `днів`])}
            </Badge>
          </div>
          <div className="bet__badge-wrapper">
            <Badge
              className="bg-success"
              variant="success">
              {formatPrice(data.price)}
            </Badge>
          </div>
        </div>

        {
          showEdit ?
            <div className="p-3 pt-5">
              <ProjectBetEditor
                price={price}
                value={{...data}}
                onFormSubmit={editSubmitHandler}
                inputChangeHandler={editInputChangeHandler}
              />
            </div> :
            <div
              className="bet__text mt-3"
              dangerouslySetInnerHTML={{__html: htmlText}}
            />
        }

        <small className="text-end d-block">
          {new Date(date).toLocaleString()}{` `}
          {
            updated.lastDate &&
              `(Оновлено ${new Date(updated.lastDate).toLocaleString()})`
          }
        </small>

        {
          author._id === user.userId &&
            <EditBar
              showEdit={data.updated < 3}
              onEdit={() => setShowEdit((prevState) => !prevState)}
              onDelete={onDeleteClick}
              modalTitle="Ви дійсно хочете видалити ставку?"
              modalText={`Ви більше не зможете добавити ставку на цей проєкт.
              Якщо ви хочете внести зміни, то оновіть ставку.`}
            />
        }
      </article>
    </>
  );
};

export default BetItem;
