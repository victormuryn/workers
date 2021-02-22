import React, {useContext, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';

import {useHttp} from '../../hooks/http.hook';
import AuthContext from '../../context/Auth.context';

import InputGroup from '../../components/input-group';
import Message from '../../components/message';
import Footer from '../../components/footer';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {AccountTypes} from '../../types/types';

const LoginPage: React.FC = () => {
  type Response = {
    token: string,
    userId: string,
    accountType: AccountTypes,
    username: string,
  };
  const {request, loading, error, clearError} = useHttp<Response>();
  const {login} = useContext(AuthContext);
  const history = useHistory();

  const [data, setData] = useState({
    username: ``,
    password: ``,
  });

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    clearError();

    const result = await request(`/api/auth/login`, `POST`, {...data});
    const {token, userId, accountType, username} = result;

    login(token, userId, accountType, username);
    history.push(`/`);
  };

  const onErrorClose = (
    e: React.MouseEvent<HTMLAnchorElement | MouseEvent>,
  ) => {
    e.preventDefault();
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
            name="username"
            value={data.username}
            placeholder="Ваш логін"
            onChange={onInputChange}
            label="Логін:"
            pattern="^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$"
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
