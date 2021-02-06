import React, {useState, useRef, useEffect} from 'react';

import './auth-page.scss';
import Footer from '../footer/footer';

const AuthPage = () => {
  const [data, setData] = useState({});

  const confirmPassword = useRef(null);

  const onChange = (event) => {
    setData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    if (data.password !== data.confirmPassword) {
      confirmPassword.current.setCustomValidity(`Паролі не співпадають`);
    } else {
      confirmPassword.current.setCustomValidity(``);
    }
  }, [data]);

  const onSubmit = (event) => {
    event.preventDefault();
    console.log(data);
  };

  return (
    <>
      <form className="auth-form" method="POST" onSubmit={onSubmit}>
        <label className="auth-form__label">
          <span className="auth-form__label-text">Ім&apos;я</span>

          <div className="auth-page__input-group">
            <div className="auth-page__input-underlined">
              <input
                required
                type="text"
                name="name"
                minLength={1}
                maxLength={20}
                onChange={onChange}
              />
              <span className="auth-page__input-label">Ваше ім&apos;я</span>
            </div>
          </div>
        </label>

        <label className="auth-form__label">
          <span className="auth-form__label-text">Електронна пошта</span>

          <div className="auth-page__input-group">
            <div className="auth-page__input-underlined">
              <input
                required
                type="email"
                name="email"
                onChange={onChange}
              />
              <span className="auth-page__input-label">Ваш email</span>
            </div>
          </div>
        </label>

        <label className="auth-form__label">
          <span className="auth-form__label-text">Телефон</span>

          <div className="auth-page__input-group">
            <div className="auth-page__input-underlined">
              <input
                required
                name="tel"
                type="tel"
                pattern="^\+?3?8?(0\d{9})$"
                onChange={onChange}
              />
              <span className="auth-page__input-label">Ваш телефон</span>
            </div>
          </div>
        </label>

        <label className="auth-form__label">
          <span className="auth-form__label-text">Пароль</span>

          <div className="auth-page__input-group">
            <div className="auth-page__input-underlined">
              <input
                required
                name="password"
                type="password"
                minLength={4}
                onChange={onChange}
              />
              <span className="auth-page__input-label">Ваш пароль</span>
            </div>
          </div>
        </label>

        <label className="auth-form__label">
          <span className="auth-form__label-text">Повторіть пароль</span>

          <div className="auth-page__input-group">
            <div className="auth-page__input-underlined">
              <input
                required
                name="confirmPassword"
                type="password"
                minLength={4}
                ref={confirmPassword}
                onChange={onChange}
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
                name="account-type"
                onChange={onChange}
              />
              <span>Виконавець</span>
            </label>

            <label className="auth-page__input-radio">
              <input
                required
                type="radio"
                value="client"
                name="account-type"
                onChange={onChange}
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

      <Footer/>
    </>
  );
};

export default AuthPage;
