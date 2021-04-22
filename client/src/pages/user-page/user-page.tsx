import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Link, useParams} from 'react-router-dom';
import {useForm} from '../../hooks/form.hook';
import api from '../../utils/api';

import './user-page.scss';

import Loader from '../../components/loader';
import Message from '../../components/message';
import UserRating from '../../components/user-rating';
import UserAvatar from '../../components/user-avatar';
import UserSocialList from '../../components/user-social-list';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

// @ts-ignore
import {CKEditor} from '@ckeditor/ckeditor5-react';
// @ts-ignore
import ClassicEditor from '../../libs/ckeditor/ckeditor.js';
// @ts-ignore
import '@ckeditor/ckeditor5-build-classic/build/translations/uk';

import {getPluralNoun, setPageMeta} from '../../utils/utils';
import {State} from '../../redux/reducer';
import {AccountTypes} from '../../types/types';

type Author = {
  cv: string,
  _id: string,
  name: string,
  quote: string,
  image: boolean,
  rating: number,
  online: string,
  surname: string,
  username: string,
  finished: number,
  categories: Array<string>,
  accountType: AccountTypes,
  location: {
    city: string,
    region: string,
    country: string,
    latitude: number,
    longitude: number,
  },
  social: {
    twitter: string,
    instagram: string,
    facebook: string,
    website: string,
    github: string,
  },
};

type Response = {
  user: Author,
  categories: Array<{
    all: number,
    place: number,
    title: string,
    group?: string,
    url: string,
    id: string,
  }>,
  rating: {
    all: number,
    place: number,
  }
};

const UserTypeToText = {
  'freelancer': `Виконавець`,
  'client': `Замовник`,
};

const UserPage: React.FC = () => {
  const {username} = useParams<{ username: string }>();
  const loggedUser = useSelector((state: State) => state.user);

  // all states
  const {form: response, setForm, inputChangeHandler} = useForm<Response>({
    user: {
      cv: ``,
      _id: ``,
      name: ``,
      quote: ``,
      rating: 0,
      surname: ``,
      finished: 0,
      username: ``,
      image: false,
      categories: [],
      accountType: `client`,
      online: `1970-01-01T00:00:00.000+00:00`,
      location: {city: '', country: '', latitude: 0, longitude: 0, region: ''},
      social: {
        facebook: '',
        github: '',
        instagram: '',
        twitter: '',
        website: '',
      },
    },
    rating: {
      all: 1,
      place: 1,
    },
    categories: [],
  });

  const {user, rating, categories} = response;
  setPageMeta(`${user.name} ${user.surname}`);

  // loading states
  const [loading, setLoading] = useState<boolean>(false);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);

  // error/warning/success states
  const [error, setError] = useState<string>(``);
  const [success, setSuccess] = useState<string>(``);
  const [warning, setWarning] = useState<string>(``);

  const [avatarName, setAvatarName] = useState<string>(``);
  const [newAvatar, setNewAvatar] = useState<FormData | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);
  const closeAvatarModal = () => setShowAvatarModal(false);

  const isUsersPage = loggedUser.userId === user._id;
  const now = +(new Date());
  const lastOnline = new Date(user.online);
  const isOnline = now - +lastOnline <= 5 * 60 * 1000; // 5 minutes

  const stars = user.rating !== 0 ?
    +(user.rating / user.finished).toFixed(2) :
    0;

  const startsPercentage = stars * 100 / 5;

  // XX очків / ХХ завершених проєктів
  const pointsText = `${user.rating} ${getPluralNoun(user.rating,
    `очко`, `очка`, `очків`,
  )} / ${user.finished} ${getPluralNoun(user.finished,
    `завершений проєкт`, `завершені проєкти`, `завершених проєктів`,
  )}`;
  const starsText = `${stars} ${getPluralNoun(stars,
    `зірка`, `зірки`, `зірок`,
  )}`;

  const getData = async () => {
    setLoading(true);
    api
      .get(`/user/${username}`, {
        headers: {
          'Authorization': `Bearer ${loggedUser.token}`,
        },
      })
      .then((response) => {
        setForm(response.data);
      })
      .catch((error) => {
        setError(error.response.data.message ||
          `Щось пішло не так, спробуйте знову.`);
      })
      .then(() => {
        setLoading(false);
      });
  };

  const categoryChangeHandler = (
    newId: string | undefined = ``,
    oldId: string | undefined = ``,
  ) => {
    const newCategories = [...user.categories];
    const oldCategoryId = user.categories.indexOf(oldId);

    if (!newId) {
      newCategories.splice(oldCategoryId, 1);
    } else if (!oldId) {
      newCategories.push(newId);
    } else {
      newCategories[oldCategoryId] = newId;
    }

    inputChangeHandler({
      name: `user.categories`,
      value: newCategories,
    });
  };

  const formSubmitHandler = async (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();

    setUpdateLoading(true);
    api
      .patch(`/user/${username}`, {...user}, {
        headers: {
          'Authorization': `Bearer ${loggedUser.token}`,
        },
      })
      .then((response) => {
        setSuccess(response.data.message);
        getData();
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.message ||
            `Щось пішло не так, спробуйте знову.`);
        }
      })
      .then(() => {
        setUpdateLoading(false);
      });
  };

  const avatarChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const {files} = e.target;

    if (files && files[0]) {
      setAvatarName(files[0].name);

      const formData = new FormData();
      formData.append(`avatar`, files[0]);
      setNewAvatar(formData);
    }
  };

  const avatarSubmitHandler = async (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();

    if (newAvatar) {
      closeAvatarModal();

      api
        .patch<{message: string}>(`/user/${username}/avatar`, newAvatar, {
          timeout: 30 * 1000, // 30 seconds
          headers: {
            'Authorization': `Bearer ${loggedUser.token}`,
          },
        })
        .then((response) => {
          setSuccess(response.data.message);
          setAvatarName(` ` + avatarName);
        })
        .catch((error) => {
          setError(error.response ?
            error.response.data.message :
            `Щось пішло не так, спробуйте знову.`,
          );
        });
    }
  };

  const getGeolocation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setWarning(``);
    setLocationLoading(true);

    const options = {
      enableHighAccuracy: true,
      maximumAge: 1000 * 60 * 60, // 1hr
      timeout: 5000,
    };

    type Position = {
      coords: {
        latitude: number,
        longitude: number,
        accuracy: number,
      }
    };

    const success = async (pos: Position) => {
      const {latitude, longitude} = pos.coords;

      api
        .patch<{ location: object }>(`/user/${username}/location`,
          {latitude, longitude}, {
            headers: {
              'Authorization': `Bearer ${loggedUser.token}`,
            },
          })
        .then((response) => {
          inputChangeHandler({
            name: `user.location`,
            value: response.data.location,
          });

          setSuccess(`Місцезнаходження оновлено!`);
          setLocationLoading(false);
        });
    };

    type Err = {
      code: number,
      message: string,
    }
    const error = (err: Err) => {
      switch (err.code) {
      case 1:
        setWarning(`Доступ заборонено. Дозвольте використання геоданих`);
        break;
      case 2:
        setWarning(`Не вдалося отримати дані. Спробуйте знову`);
        break;
      case 3:
        setWarning(`Виникла помилка, спробуйте знову`);
        break;
      }

      setLocationLoading(false);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [username]);

  if (loading) {
    return <Loader/>;
  }

  const pageContent = (
    <Row className="main-body mt-5">
      <Col lg={4} className="mb-3">
        <Card as="section">
          <Card.Body>
            <div
              className="d-flex flex-column align-items-center text-center">

              <div className="user__avatar">
                <UserAvatar
                  width={150}
                  get={avatarName}
                  image={user.image}
                  username={username}
                />

                {isUsersPage &&
                  <Button
                    variant="success"
                    className="user__avatar-change"
                    onClick={() => setShowAvatarModal(true)}
                  >
                    <svg>
                      <use href="#icon-edit"/>
                    </svg>
                  </Button>
                }
              </div>

              <div className="mt-3">
                <h4>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="user-online">
                      {
                        isOnline ?
                          <>Зараз у мережі</> :
                          <>Був(ла) у мережі {lastOnline.toLocaleString()}</>
                      }
                    </Tooltip>}
                  >
                    <div
                      className={`user-online bg-${isOnline ?
                        `success` :
                        `secondary`}`
                      }
                    >
                      <span className="visually-hidden">
                        {isOnline ? `Он` : `Офф`}лайн
                      </span>
                    </div>
                  </OverlayTrigger> {user.name} {user.surname}
                </h4>

                {
                  isUsersPage ?
                    <Form.Control
                      type="text"
                      minLength={2}
                      maxLength={40}
                      name="user.quote"
                      value={user.quote}
                      className="my-2 text-center"
                      onChange={inputChangeHandler}
                      placeholder="Вашe життєве кредо"
                    /> :
                    <p className="text-secondary mb-1">{user.quote}</p>
                }

                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id={`rating`}>{pointsText}</Tooltip>
                  }>

                  <div className="user__rating mx-auto mb-3">
                    <div
                      className="user__rating--filled"
                      style={{width: `${startsPercentage}%`}}
                    />
                    <span className="visually-hidden">{starsText}</span>
                  </div>
                </OverlayTrigger>

                <Button
                  as={Link}
                  variant="outline-primary"
                  to={`/messages?user=${user.username}`}
                >
                  Написати
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* SOCIAL LINKS*/}
        <Card className="mt-3" as="section">
          <UserSocialList
            social={user.social}
            editable={isUsersPage}
            onInputChange={inputChangeHandler}
          />
        </Card>
        {/* /.SOCIAL LINKS */}

        <UserRating
          rating={rating}
          isOwner={isUsersPage}
          categories={categories}
          onCategoryChange={categoryChangeHandler}
        />

      </Col>
      <Col lg={8}>
        <Card className="mb-3" as="section">
          <Card.Body>
            <Row className="align-items-center mx-0">
              <Col sm={3}>
                <h6 className="mb-0">Ім&apos;я</h6>
              </Col>
              <Col sm={9} className="text-secondary">
                {
                  isUsersPage ?
                    <Form.Control
                      required
                      minLength={2}
                      maxLength={20}
                      type="text"
                      name="user.name"
                      value={user.name}
                      className="w-auto"
                      placeholder="Ваше ім'я"
                      onChange={inputChangeHandler}
                    /> :
                    user.name
                }
              </Col>
            </Row>
            <hr/>

            <Row className="align-items-center mx-0">
              <Col sm={3}>
                <h6 className="mb-0">Прізвище</h6>
              </Col>
              <Col sm={9} className="text-secondary">
                {
                  isUsersPage ?
                    <Form.Control
                      required
                      type="text"
                      minLength={2}
                      maxLength={20}
                      className="w-auto"
                      name="user.surname"
                      value={user.surname}
                      placeholder="Ваше прізвище"
                      onChange={inputChangeHandler}
                    /> :
                    user.surname
                }
              </Col>
            </Row>

            <hr/>
            <Row className="align-items-center mx-0">
              <Col sm={3}>
                <h6 className="mb-0">Ім&apos;я користувача</h6>
              </Col>
              <Col sm={9} className="text-secondary">{user.username}</Col>
            </Row>

            <hr/>
            <Row className="align-items-center mx-0">
              <Col sm={3}>
                <h6 className="mb-0">Тип профілю</h6>
              </Col>
              <Col sm={9} className="text-secondary">
                {UserTypeToText[user.accountType]}
              </Col>
            </Row>

            {
              (user.location.city || isUsersPage) &&
              <>
                <hr/>
                <Row className="align-items-center mx-0">
                  <Col sm={3}>
                    <h6 className="mb-0">Місцеположення</h6>
                  </Col>
                  <Col sm={9} className="text-secondary">
                    {user.location.city &&
                    <span>
                      {user.location.city}, {user.location.country}{` `}
                    </span>
                    }

                    {
                      isUsersPage &&
                      <Button
                        type="primary"
                        className="ms-sm-2"
                        onClick={getGeolocation}
                        disabled={locationLoading}
                      >
                        Оновити розташування
                      </Button>
                    }
                  </Col>
                </Row>
              </>
            }

          </Card.Body>
        </Card>

        {
          (user.cv || isUsersPage) &&
          <Row className="gutters-sm" as={`section`}>
            <Col className="mb-3">
              <h3 className="text-center mt-3 mb-4">
                {
                  isUsersPage ?
                    `Інформація про вас` :
                    `Резюме`
                }
              </h3>

              <Card>
                <Card.Body>
                  {
                    isUsersPage ?
                      <CKEditor
                        name="cv"
                        editor={ClassicEditor}
                        data={user.cv}
                        config={{
                          toolbar: {
                            items: [
                              'heading', '|',
                              'bold', 'italic', 'link', 'bulletedList',
                              'numberedList', '|',
                              'alignment:left', 'alignment:right',
                              'alignment:center', 'alignment:justify', '|',
                              'outdent', 'indent', '|',
                              'imageUpload', 'blockQuote', 'undo', 'redo',
                            ],
                          },
                          image: {
                            toolbar: [
                              'imageTextAlternative',
                              'imageStyle:full',
                              'imageStyle:side',
                            ],
                          },
                          placeholder: `Опишіть детально ваші переваги,
                            щоб замовник вибрав саме вас`,
                          language: `uk`,
                        }}
                        onChange={
                          (event: any, editor: any) => {
                            inputChangeHandler({
                              name: `user.cv`,
                              value: editor.getData(),
                            });
                          }
                        }
                      /> :
                      <p
                        className="p-3"
                        dangerouslySetInnerHTML={{__html: user.cv}}
                      />
                  }
                </Card.Body>
              </Card>
            </Col>
          </Row>
        }

        {
          isUsersPage &&
          <div className="text-center mt-3">
            <Button
              size="lg"
              type="submit"
              variant="success"
              disabled={updateLoading}
            >
              Зберегти зміни
            </Button>
          </div>
        }
      </Col>
    </Row>
  );

  return (
    <Container>
      {success &&
        <Message
          text={success}
          type="success"
          onClose={() => setSuccess(``)}
        />
      }

      {warning &&
        <Message
          text={warning}
          type="warning"
          onClose={() => setWarning(``)}
        />
      }

      {error &&
        <Message
          text={error}
          type="danger"
          onClose={() => setError(``)}
        />
      }

      {
        isUsersPage ?
          <Form onSubmit={formSubmitHandler}>{pageContent}</Form> :
          <>{pageContent}</>
      }

      {isUsersPage && (
        <Modal
          show={showAvatarModal}
          onHide={closeAvatarModal}
        >
          <Form onSubmit={avatarSubmitHandler}>
            <Modal.Header closeButton>
              <Modal.Title>Змінити фотографію користувача</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.File
                  custom
                  id="avatar"
                  name="avatar"
                  size={5242880}
                  data-browse="Вибрати"
                  accept=".png, .jpg, .jpeg"
                  onChange={avatarChangeHandler}
                  label={`${avatarName.trim() || `Виберіть зображення`}`}
                />
                <Form.Label className="text-muted mt-3">
                  Зображення повинне бути до 5МБ
                </Form.Label>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="reset"
                variant="secondary"
                onClick={closeAvatarModal}
              >
                Закрити
              </Button>

              <Button type="submit" variant="success">
                Зберегти фото
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </Container>
  );
};

export default UserPage;
