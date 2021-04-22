import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';

import './bet-item.scss';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';

import ProjectBetEditor from '../project-bet-editor';

import {State} from '../../redux/reducer';
import {formatPrice, getPluralNoun} from '../../utils/utils';
import {useHttp} from '../../hooks/http.hook';
import Message from '../message';
import {MinUser} from "../../types/types";

type User = {
  _id: string,
  name: string,
  image: boolean,
  surname: string,
  username: string,
}

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

const BetItem: React.FC<Props> = (props) => {
  const {_id, text, price, term, date, onDeleteClick, updated, author} = props;
  const user = useSelector((state: State) => state.user);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [data, setData] = useState<{
    price: number,
    text: string,
    term: number,
  }>({price, term, text});

  const htmlText = data
    .text
    .split(`\n`)
    .filter((i) => i)
    .map((i) => `<p>${i}</p>`)
    .join(`\n`);

  const closeModal = () => setShowModal(false);
  const openModal = () => setShowModal(true);

  const deleteClickHandler = (e: React.MouseEvent) => {
    onDeleteClick(e);
    closeModal();
  };

  const {
    request: editRequest,
    error: editError,
    clearError: editClearError,
  } = useHttp<{message?: string}>();
  const editInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const editSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await editRequest(`/api/bet/${_id}`, `PATCH`, {
      ...data,
      date: new Date(),
    }, {
      'Authorization': `Bearer ${user.token}`,
    });

    if (response.message) {
      setShowEdit(false);
    }
  };

  return (
    <>
      {
        editError &&
          <Message
            type="danger"
            text={editError}
            onClose={() => {
              editClearError();
              setShowEdit(false);
            }}
          />
      }
      <article className="project__content project__bet p-4">
        <div className="bet__author-line d-flex align-content-center">
          <Link to={`/user/${author.username}`} className="project__user-link">
            {
              author.image ?
                <picture>
                  <source
                    srcSet={`/img/users/${author.username}.webp`}
                    type="image/webp"
                  />

                  <source
                    srcSet={`/img/users/${author.username}.jpg`}
                    type="image/jpeg"
                  />

                  <img
                    alt={author.username}
                    src={`/img/users/${author.username}.jpg`}
                    className="rounded-circle"
                  />
                </picture> :
                <img
                  alt={author.username}
                  src="/img/default.svg"
                  className="rounded-circle"
                />
            } {author.name} {author.surname}
          </Link>

          <div className="ms-auto me-2 bet__badge-wrapper">
            <Badge
              className="bg-primary"
              variant="primary">
              {data.term} {getPluralNoun(data.term, `день`, `дні`, `днів`)}
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
          author._id === user.userId ?
            <div className="bet__author-line mt-3
         d-flex align-content-center justify-content-end">
              {
                updated.count < 3 && <div className="ms-2 bet__badge-wrapper">
                  <Button
                    title="Редагувати"
                    variant="outline-success"
                    onClick={() => setShowEdit((prevState) => !prevState)}
                  >
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"
                      className="bet__delete-icon">
                      <use href="#icon-edit"/>
                    </svg>
                  </Button>
                </div>
              }

              <div className="ms-2 bet__badge-wrapper">
                <Button
                  title="Видалити"
                  variant="outline-danger"
                  onClick={openModal}>
                  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"
                    className="bet__delete-icon">
                    <use href="#icon-danger"/>
                  </svg>
                </Button>
              </div>
            </div> :
            null
        }
      </article>

      {
        author._id === user.userId &&
          <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>Ви дійсно хочете видалити ставку?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Ви більше не зможете добавити ставку на цей проєкт.
            Якщо ви хочете внести зміни, то оновіть ставку.</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Закрити
              </Button>
              <Button variant="danger" onClick={deleteClickHandler}>
                Видалити
              </Button>
            </Modal.Footer>
          </Modal>
      }
    </>
  );
};

export default BetItem;
