import React, {useContext, useState} from 'react';
import {Link} from 'react-router-dom';

import {useHttp} from '../../../hooks/http.hook';
import AuthContext from '../../../context/Auth.context';

import {useDispatch} from 'react-redux';
import {ActionCreator} from '../../../redux/reducer';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import InputGroup from '../../components/input-group/input-group';
import Message from '../../components/message/message';
import Footer from '../../components/footer/footer';

const LoginPage = () => {
  const {request, loading, error, clearError} = useHttp();
  const {login} = useContext(AuthContext);
  const dispatch = useDispatch();

  const [data, setData] = useState({
    email: ``,
    password: ``,
  });

  const onInputChange = (event) => {
    const {name, value} = event.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    clearError();

    const email = data.email.toLowerCase();
    const result = await request(`/api/auth/login`, `POST`, {...data, email});

    login(result.token, result.userId);
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

        <p className="auth-header__text">
          Увійдіть та почніть змінювати своє життя
        </p>
      </header>

      {error && <Message text={error} type="danger" onClose={onErrorClose}/>}

      <Container>
        <form className="auth-form mt-5" method="POST" onSubmit={onSubmit}>
          <InputGroup
            name="email"
            type="email"
            value={data.email}
            placeholder="Ваш email"
            onChange={onInputChange}
            label="Електронна пошта:"
          />

          <InputGroup
            minLength={6}
            name="password"
            type="password"
            label="Пароль:"
            value={data.password}
            placeholder="Ваш пароль"
            onChange={onInputChange}
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
              <div
                className="auth-page__input-group auth-page__input-group--rules"
              >
                <Button
                  type="submit"
                  disabled={loading}
                  variant="success"
                  className="auth-page__submit"
                >
                  Увійти
                </Button>
              </div>
            </Col>
          </Row>

          <p className="auth-page__login">
            Ще не зареєстровані? <Link to="/auth">Зареєструватися</Link>
          </p>
        </form>
      </Container>

      <Footer />
    </>
  );
};

export default LoginPage;
