import React, {useState, useRef, useEffect, useContext} from 'react';
import AuthContext from '../../context/Auth.context';
import {useForm} from '../../hooks/form.hook';
import {Link} from 'react-router-dom';
import api from '../../utils/api';

import './auth-page.scss';

import Footer from '../../components/footer';
import Message from '../../components/message';
import InputGroup from '../../components/input-group';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import {AccountTypes} from '../../types/types';
import {setPageMeta} from '../../utils/utils';

type Response = {
  name: string,
  token: string,
  image: {
    extension: string,
    buffer: string,
  },
  userId: string,
  surname: string,
  username: string,
  accountType: AccountTypes,
};

const AuthPage: React.FC = () => {
  setPageMeta(`Зареєструватися`);

  const {login} = useContext(AuthContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>(``);

  // Form data (default values)
  const {form: data, inputChangeHandler} = useForm({
    name: ``,
    surname: ``,
    username: ``,
    email: ``,
    phone: ``,
    password: ``,
    confirmPassword: ``,
    accountType: ``,
  });

  // Confirm password element (to check is it equals to first one)
  const confirmPasswordElement = useRef<HTMLInputElement>(null);

  // on confirmPassword change
  useEffect(() => {
    const {password, confirmPassword} = data;

    // if passwords are equals and confirmPassword is not empty
    if (confirmPassword && password !== confirmPassword) {
      confirmPasswordElement
        .current!
        .setCustomValidity(`Паролі не співпадають`);
    } else {
      confirmPasswordElement
        .current!
        .setCustomValidity(``);
    }
  }, [data.confirmPassword]);

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError(``);

    const email = data.email.toLowerCase();
    let {phone, password} = data;

    // +38-0**-**-**-***
    switch (phone[0]) {
    case `3`:
      phone = `+${phone}`;
      break;

    case `0`:
      phone = `+38${phone}`;
      break;
    }

    // register
    setLoading(true);
    api
      .post(`/auth/register`, {...data, phone, email})
      .then(() => {
        // login
        api
          .post<Response>(`/auth/login`, {
            username: data.username, password,
          })
          .then((response) => login(response.data))
          .catch((error) => {
            setError(error.response.data.message ||
              `Щось пішло не так, спробуйте знову`);
          });
      })
      .catch((error) => {
        setError(error.response.data.message ||
          `Щось пішло не так, спробуйте знову`);
      })
      .then(() => {
        setLoading(false);
      });
  };

  const onErrorClose = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setError(``);
  };

  return (
    <>
      <header className="auth-header">
        <h2 className="auth-header__logo">
          <Link to="/">Workers</Link>
        </h2>
        <p className="auth-header__text">Зареєструйся у декілька кліків та
          отримай безліч переваг</p>
      </header>

      {error && <Message text={error} type="danger" onClose={onErrorClose}/>}

      <Container>
        <form onSubmit={onSubmit} method="POST" className="mt-5 auth-form">
          <InputGroup
            name="name"
            label="Ім'я:"
            minLength={2}
            maxLength={20}
            value={data.name}
            placeholder="Ваше ім'я"
            onChange={inputChangeHandler}
          />

          <InputGroup
            minLength={2}
            maxLength={20}
            name="surname"
            label="Прізвище:"
            value={data.surname}
            placeholder="Ваше прізвище"
            onChange={inputChangeHandler}
          />

          <InputGroup
            minLength={2}
            maxLength={20}
            label="Логін:"
            name="username"
            value={data.username}
            placeholder="Ваш логін"
            onChange={inputChangeHandler}
            pattern="^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$"
          />

          <InputGroup
            name="email"
            type="email"
            value={data.email}
            placeholder="Ваш email"
            label="Електронна пошта:"
            onChange={inputChangeHandler}
          />

          <InputGroup
            name="phone"
            type="tel"
            label="Телефон:"
            value={data.phone}
            placeholder="Ваш телефон"
            pattern="^(\+?38)?(0\d{9})$"
            onChange={inputChangeHandler}
          />

          <InputGroup
            minLength={6}
            name="password"
            type="password"
            label="Пароль:"
            value={data.password}
            placeholder="Ваш пароль"
            onChange={inputChangeHandler}
          />

          <InputGroup
            minLength={6}
            type="password"
            name="confirmPassword"
            label="Повторіть пароль:"
            value={data.confirmPassword}
            onChange={inputChangeHandler}
            refProp={confirmPasswordElement}
            placeholder="Повторіть ваш пароль"
          />

          <Row as="label" className="auth-form__label">
            <Col
              as="span"
              className="text-right"
              md={{
                span: 2,
                offset: 4,
              }}/>

            <Col className="position-relative" md={3}>
              <label className="auth-page__input-radio">
                <input
                  required
                  type="radio"
                  value="freelancer"
                  name="accountType"
                  onChange={inputChangeHandler}
                />
                <span>Виконавець</span>
              </label>

              <label className="auth-page__input-radio">
                <input
                  required
                  type="radio"
                  value="client"
                  name="accountType"
                  onChange={inputChangeHandler}
                />
                <span>Замовник</span>
              </label>
            </Col>
          </Row>

          <Row as="label" className="auth-form__label">
            <Col
              as="span"
              md={{
                span: 2,
                offset: 4,
              }}/>

            <Col className="position-relative" md={3}>
              <div
                className="auth-page__input-group auth-page__input-group--rules"
              >
                <input
                  required
                  id="rules"
                  name="rules"
                  type="checkbox"
                /> Я погоджуюся з <a href="#" target="_blank">правилами
                використання сервісу</a>.
              </div>
            </Col>
          </Row>

          <Row as="label" className="auth-form__label">
            <Col
              as="span"
              md={{
                span: 2,
                offset: 4,
              }}/>

            <Col className="position-relative" md={3}>
              <div
                className="auth-page__input-group auth-page__input-group--rules"
              >
                <Button
                  type="submit"
                  disabled={loading}
                  variant="success"
                  className="auth-page__submit btn"
                >
                  Зареєструватися
                </Button>
              </div>
            </Col>
          </Row>

          <p className="auth-page__login">
            Уже зареєстровані? <Link to="/login">Увійдіть</Link>
          </p>
        </form>
      </Container>


      <Footer/>
    </>
  );
};

export default AuthPage;
