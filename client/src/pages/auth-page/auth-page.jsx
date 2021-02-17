import React, {useState, useRef, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';

import './auth-page.scss';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import InputGroup from '../../components/input-group';
import Footer from '../../components/footer';
import Message from '../../components/message/message';

import {useHttp} from '../../hooks/http.hook';
import AuthContext from '../../context/Auth.context';

const AuthPage = () => {
  const {request, loading, error, clearError} = useHttp();
  const {login} = useContext(AuthContext);

  // Form data (default values)
  const [data, setData] = useState({
    name: ``,
    surname: ``,
    login: ``,
    email: ``,
    phone: ``,
    password: ``,
    confirmPassword: ``,
    accountType: ``,
  });

  // Confirm password element (to check is it equals to first one)
  const confirmPasswordElement = useRef(null);

  const onInputChange = (event) => {
    const {value, name} = event.target;

    // set new data (prevState + new value)
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // on confirmPassword change
  useEffect(() => {
    const {password, confirmPassword} = data;

    // if passwords are equals and confirmPassword is not empty
    if (confirmPassword && password !== confirmPassword) {
      confirmPasswordElement.current.setCustomValidity(`Паролі не співпадають`);
    } else {
      confirmPasswordElement.current.setCustomValidity(``);
    }
  }, [data.confirmPassword]);

  const onSubmit = async (event) => {
    event.preventDefault();
    clearError();

    const email = data.login.toLowerCase();
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
    await request(`/api/auth/register`, `POST`, {...data, phone, email});

    // login after register
    const response = await request(`/api/auth/login`, `POST`, {
      login: data.login, password,
    });

    const {token, userId, accountType, login: userLogin} = response;
    login(token, userId, accountType, userLogin);
  };

  const onErrorClose = (event) => {
    event.preventDefault();
    clearError();
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
            onChange={onInputChange}
          />

          <InputGroup
            name="surname"
            label="Прізвище:"
            minLength={2}
            maxLength={20}
            value={data.surname}
            placeholder="Ваше прізвище"
            onChange={onInputChange}
          />

          <InputGroup
            name="login"
            label="Логін:"
            minLength={2}
            maxLength={20}
            value={data.login}
            placeholder="Ваш логін"
            onChange={onInputChange}
            pattern="^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$"
          />

          <InputGroup
            name="email"
            type="email"
            label="Електронна пошта:"
            value={data.email}
            placeholder="Ваш email"
            onChange={onInputChange}
          />

          <InputGroup
            name="phone"
            type="tel"
            label="Телефон:"
            value={data.phone}
            placeholder="Ваш телефон"
            pattern="^(\+?38)?(0\d{9})$"
            onChange={onInputChange}
          />

          <InputGroup
            name="password"
            type="password"
            label="Пароль:"
            value={data.password}
            minLength={6}
            placeholder="Ваш пароль"
            onChange={onInputChange}
          />

          <InputGroup
            minLength={6}
            type="password"
            name="confirmPassword"
            onChange={onInputChange}
            label="Повторіть пароль:"
            value={data.confirmPassword}
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
              }} />

            <Col className="position-relative" md={3}>
              <label className="auth-page__input-radio">
                <input
                  required
                  type="radio"
                  value="freelancer"
                  name="accountType"
                  onChange={onInputChange}
                />
                <span>Виконавець</span>
              </label>

              <label className="auth-page__input-radio">
                <input
                  required
                  type="radio"
                  value="client"
                  name="accountType"
                  onChange={onInputChange}
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
              }} />

            <Col className="position-relative" md={3}>
              <div
                className="auth-page__input-group auth-page__input-group--rules"
              >
                <input
                  required
                  id="rules"
                  name="rules"
                  type="checkbox"
                  value={data.rules}
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
              }} />

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


      <Footer />
    </>
  );
};

export default AuthPage;
