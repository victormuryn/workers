import React, {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';

import './auth-page.scss';
import Footer from '../footer/footer';

const AuthPage = () => {
  // Form data (default values)
  const [data, setData] = useState({
    name: ``,
    email: ``,
    tel: ``,
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

  const onSubmit = (event) => {
    event.preventDefault();
    console.log(data);
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


      <form className="auth-form" method="POST" onSubmit={onSubmit}>
        <label className="auth-form__label">
          <span className="auth-form__label-text">Ім&apos;я:</span>

          <div className="auth-page__input-group">
            <div className="auth-page__input-underlined">
              <input
                required
                type="text"
                name="name"
                minLength={1}
                maxLength={20}
                onChange={onInputChange}
                value={data.name}
              />
              <span className="auth-page__input-label">Ваше ім&apos;я</span>
            </div>
          </div>
        </label>

        <label className="auth-form__label">
          <span className="auth-form__label-text">Електронна пошта:</span>

          <div className="auth-page__input-group">
            <div className="auth-page__input-underlined">
              <input
                required
                type="email"
                name="email"
                onChange={onInputChange}
                value={data.email}
              />
              <span className="auth-page__input-label">Ваш email:</span>
            </div>
          </div>
        </label>

        <label className="auth-form__label">
          <span className="auth-form__label-text">Телефон:</span>

          <div className="auth-page__input-group">
            <div className="auth-page__input-underlined">
              <input
                required
                name="tel"
                type="tel"
                pattern="^\+?3?8?(0\d{9})$"
                onChange={onInputChange}
                value={data.tel}
              />
              <span className="auth-page__input-label">Ваш телефон</span>
            </div>
          </div>
        </label>

        <label className="auth-form__label">
          <span className="auth-form__label-text">Пароль:</span>

          <div className="auth-page__input-group">
            <div className="auth-page__input-underlined">
              <input
                required
                name="password"
                type="password"
                minLength={4}
                onChange={onInputChange}
                value={data.password}
              />
              <span className="auth-page__input-label">Ваш пароль</span>
            </div>
          </div>
        </label>

        <label className="auth-form__label">
          <span className="auth-form__label-text">Повторіть пароль:</span>

          <div className="auth-page__input-group">
            <div className="auth-page__input-underlined">
              <input
                required
                name="confirmPassword"
                type="password"
                minLength={4}
                ref={confirmPasswordElement}
                value={data.confirmPassword}
                onChange={onInputChange}
              />

              <span className="auth-page__input-label">
                Повторіть ваш пароль
              </span>
            </div>
          </div>
        </label>

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
            <button type="submit" className="auth-page__submit btn btn-success">
              Зареєструватися
            </button>
          </div>
        </div>
      </form>

      <Footer color="#fafafa"/>
    </>
  );
};

export default AuthPage;
