import React, {useState, useRef, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';

import './auth-page.scss';

import InputGroup from '../input-group/input-group';
import Footer from '../footer/footer';
import Message from '../message/message';

import {useHttp} from '../../../hooks/http.hook';
import AuthContext from '../../../context/Auth.context';


const AuthPage = () => {
  const {request, loading, error, clearError} = useHttp();
  const {login} = useContext(AuthContext);

  // Form data (default values)
  const [data, setData] = useState({
    name: ``,
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

    // register
    await request(`/api/auth/register`, `POST`, {...data});

    // login after register
    const response = await request(`/api/auth/login`, `POST`, {
      email: data.email,
      password: data.password,
    });

    login(response.token, login.userId);
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

      <form className="auth-form" method="POST" onSubmit={onSubmit}>
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
          pattern="^\+?3?8?(0\d{9})$"
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

        <div className="auth-form__label">
          <span className="auth-form__label-text"/>

          <div className="auth-page__input-group">
            <label className="auth-page__input-radio">
              <input
                required
                type="radio"
                value="master"
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
          </div>
        </div>

        <label className="auth-form__label">
          <span className="auth-form__label-text"/>

          <div className="auth-page__input-group auth-page__input-group--rules">
            <input
              required
              id="rules"
              name="rules"
              type="checkbox"
              value={data.rules}
            />

            Я погоджуюся з <a href="#" target="_blank">правилами використання
            сервісу</a>.
          </div>
        </label>

        <div className="auth-form__label">
          <span className="auth-form__label-text"/>

          <div className="auth-page__input-group auth-page__input-group--rules">
            <button
              type="submit"
              disabled={loading}
              className="auth-page__submit btn btn-success">
              Зареєструватися
            </button>
          </div>
        </div>

        <p className="auth-page__login">
          Уже зареєстровані? <Link to="/login">Увійдіть</Link>
        </p>
      </form>

      <Footer color="#fafafa"/>
    </>
  );
};

export default AuthPage;
