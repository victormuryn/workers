import React, {useContext, useState} from 'react';
import {Link} from 'react-router-dom';

import {useHttp} from '../../../hooks/http.hook';
import AuthContext from '../../../context/Auth.context';

import InputGroup from '../input-group/input-group';
import Message from '../message/message';
import Footer from '../footer/footer';

const LoginPage = () => {
  const {request, loading, error, clearError} = useHttp();
  const {login} = useContext(AuthContext);

  const [data, setData] = useState({
    email: ``,
    password: ``,
  });

  const onInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
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
        <p className="auth-header__text">Увійдіть та почніть ...</p>
      </header>

      {error && <Message text={error} type="danger" onClose={onErrorClose}/>}

      <form className="auth-form" method="POST" onSubmit={onSubmit}>
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

        <div className="auth-form__label">
          <span className="auth-form__label-text"/>

          <div className="auth-page__input-group auth-page__input-group--rules">
            <button
              type="submit"
              disabled={loading}
              className="auth-page__submit btn btn-success">
              Увійти
            </button>
          </div>
        </div>

        <p className="auth-page__login">
          Ще не зареєстровані? <Link to="/auth">Зареєструватися</Link>
        </p>
      </form>

      <Footer color="#fafafa"/>
    </>
  );
};

export default LoginPage;
