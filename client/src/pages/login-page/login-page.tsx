import React, {useContext, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import AuthContext from '../../context/Auth.context';
import {useForm} from '../../hooks/form.hook';
import api from '../../utils/api';

import Footer from '../../components/footer';
import Message from '../../components/message';
import InputGroup from '../../components/input-group';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import {AccountTypes} from '../../types/types';
import {setPageMeta} from '../../utils/utils';

type Response = {
  token: string,
  userId: string,
  accountType: AccountTypes,
  username: string,
};

type FormData = {
  username: string,
  password: string,
};

const LoginPage: React.FC = () => {
  setPageMeta(`Увійти`);

  const {login} = useContext(AuthContext);
  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>(``);

  const {form: data, inputChangeHandler} = useForm<FormData>({
    username: ``,
    password: ``,
  });

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);

    api
      .post<Response>(`/auth/login`, {...data})
      .then((response) => {
        const {token, userId, accountType, username} = response.data;
        login(token, userId, accountType, username);
        history.push(`/`);
      })
      .catch((error) => {
        setError(error.response.data.message ||
          `Щось пішло не так, спробуйте знову.`);
      })
      .then(() => {
        setLoading(false);
      });
  };

  const onErrorClose = (
    e: React.MouseEvent<HTMLAnchorElement | MouseEvent>,
  ) => {
    e.preventDefault();
    setError(``);
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
            label="Логін:"
            name="username"
            value={data.username}
            placeholder="Ваш логін"
            onChange={inputChangeHandler}
            pattern="^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$"
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
