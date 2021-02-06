import React, {useEffect} from 'react';
import {WOW} from 'wowjs';

import './main-page.scss';

import Footer from '../footer/footer.jsx';

const MainPage = () => {
  useEffect(() => {
    new WOW({
      live: false,
      offset: 50,
      mobile: false,
    }).init();
  });

  return (
    <>
      <header className="header">
        <div className="header__line">
          <h2 className="header__logo"><a href="/">Workers</a></h2>

          <div className="header__btns-wrapper">
            <a href="#" className="header__btn btn btn-success">Регістрація</a>
            <a href="#" className="header__btn btn btn-primary">Увійти</a>
          </div>
        </div>

        <div className="header__main-text">
          <h1 className="header__title">Шукаєш <span className="header__title--animation">спеціаліста</span>?</h1>

          <div className="header__btns-wrapper">
            <a href="#" className="header__main-btn header__btn header__main-btn--get-master btn btn-success">Знайти
              спеціаліста</a>
            <a href="#" className="header__main-btn header__btn header__main-btn--get-work btn btn-success">Знайти
              роботу</a></div>
        </div>
      </header>

      <section className="why">
        <h2 className="why__title">Чому саме ми?</h2>

        <ul className="why__list">
          <li className="why__item">
            <div className="why__item-img-wrapper">
              <img src="./img/one.svg" alt="№1 у світі" className="why__item-img"/>
            </div>

            <h5 className="why__item-title">Унікальний сервіс</h5>
            <p className="why__item-text">На сьогодні наш сервіс має найбільшу базу клієнтів та немає аналогів у всьому
              світі, тому тобі швидко вдасться знайти потрібного фахівця!</p>
          </li>

          <li className="why__item">
            <div className="why__item-img-wrapper">
              <img src="./img/worker.svg" alt="Перевірений професіонал" className="why__item-img"/>
            </div>

            <h5 className="why__item-title">Величезна кількість робітників</h5>
            <p className="why__item-text">Понад 1000 професіоналів готові допомогти тобі у будь-який момент. Усі
              спеціалісти проходять обов'язкову перевірку, щоб ти був впевнений у якості роботи.</p>
          </li>

          <li className="why__item">
            <div className="why__item-img-wrapper">
              <img src="./img/plane.svg" alt="Захист" className="why__item-img"/>
            </div>

            <h5 className="why__item-title">100% надійно</h5>
            <p className="why__item-text">Перед початком роботи гроші резервуються, щоб ти був переконаний в успішному
              завершенні проєкту. У разі, якщо робота не буде виконана — ми вернемо гроші!</p>
          </li>
        </ul>
      </section>

      <section className="custom wow fadeIn">
        <h2 className="custom__title">Працюємо так, як зручно тобі</h2>

        <picture>
          <source srcSet="./img/work.webp, ./img/work@2x.webp 2x" type="image/webp"/>
          <source srcSet="./img/work.jpg, ./img/work@2x.jpg 2x" type="image/jpeg"/>
          <img src="./img/work.jpg" alt="Стараємося для Вас" className="custom__img"/>
        </picture>

        <p className="custom__text">Резервація грошей, гнучка система роботи, простота, швидка технічна підтримка: усе,
          що потрібно для комфортної співпраці!</p>
      </section>

      <section className="how-it-works">
        <h2 className="how-it-works__title">Робота у 5 простих кроків</h2>

        <ol className="how-it-works__list">
          <li className="how-it-works__item how-it-works__item--create wow slideInLeft">
            <h4 className="how-it-works__item-title">1 Створіть проєкт</h4>
            <p className="how-it-works__item-text">Детально опишіть завдання та побажання для виконавців</p>
          </li>

          <li className="how-it-works__item how-it-works__item--choose wow slideInRight">
            <h4 className="how-it-works__item-title">2 Виберіть виконавця</h4>
            <p className="how-it-works__item-text">Оберіть виконавця за ціною, термінами, відгуками та портфоліо</p>
          </li>

          <li className="how-it-works__item how-it-works__item--reserve wow slideInLeft">
            <h4 className="how-it-works__item-title">3 Зарезервуйте кошти</h4>
            <p className="how-it-works__item-text">Після вибору, зарезервуйте кошти та розпочніть роботу з
              виконавцем</p>
          </li>

          <li className="how-it-works__item how-it-works__item--follow wow slideInRight">
            <h4 className="how-it-works__item-title">4 Слідкуйте за ходом роботи</h4>
            <p className="how-it-works__item-text">Відстежуйте виконання роботи, контролюйте деталі у чаті з
              виконавцем</p>
          </li>

          <li className="how-it-works__item how-it-works__item--reviews wow slideInLeft">
            <h4 className="how-it-works__item-title">5 Завершіть виконаний проєкт</h4>
            <p className="how-it-works__item-text">Після закінчення роботи підтвердіть виконання та обміняйтеся
              відгуками</p>
          </li>

          <li className="how-it-works__item how-it-works__item--done wow slideInRight">
            <div className="visually-hidden">Кінець</div>
          </li>
        </ol>
      </section>

      <section className="categories wow fadeIn">
        <h2 className="categories__title">Найпопулярніші категорії</h2>

        <ul className="categories__list">
          <li className="categories__item">
            <a href="#">
              <img src="./img/pipeline.svg" alt="Сантехніка" className="categories__item-img"/>
              <h5 className="categories__item-title"> Сантехніка</h5>
            </a>
          </li>

          <li className="categories__item">
            <a href="#">
              <img src="./img/plug.svg" alt="Електрика" className="categories__item-img"/>
              <h5 className="categories__item-title">Електрика</h5>
            </a>
          </li>

          <li className="categories__item">
            <a href="#">
              <img src="./img/delivery.svg" alt="Доставка" className="categories__item-img"/>
              <h5 className="categories__item-title">Доставка</h5>
            </a>
          </li>

          <li className="categories__item">
            <a href="#">
              <img src="./img/service.svg" alt="Автосервіс" className="categories__item-img"/>
              <h5 className="categories__item-title">Автосервіс</h5>
            </a>
          </li>

          <li className="categories__item">
            <a href="#">
              <img src="./img/paint-bucket.svg" alt="Ремонт" className="categories__item-img"/>
              <h5 className="categories__item-title">Ремонт</h5>
            </a>
          </li>

          <li className="categories__item">
            <a href="#">
              <img src="./img/book.svg" alt="Навчання" className="categories__item-img"/>
              <h5 className="categories__item-title">Навчання</h5></a></li>
          <li className="categories__item">
            <a href="#">
              <img src="./img/it.svg" alt="IT-послуги" className="categories__item-img"/>
              <h5 className="categories__item-title">IT-послуги</h5>
            </a>
          </li>

          <li className="categories__item">
            <a href="#">
              <img src="./img/camera.svg" alt="Фотосесії" className="categories__item-img
              "/> <h5 className="categories__item-title">Фотосесії</h5>
            </a>
          </li>

          <li className="categories__item">
            <a href="#">
              <img src="./img/cleaning.svg" alt="Прибирання" className="categories__item-img"/>
              <h5 className="categories__item-title">Прибирання</h5>
            </a>
          </li>

          <li className="categories__item">
            <a href="#">
              <img src="./img/other.svg" alt="Інше" className="categories__item-img"/>
              <h5 className="categories__item-title">Інше</h5>
            </a>
          </li>

        </ul>

        <div className="categories__link-wrapper">
          <a href="#" className="categories__all-link link-success">
            Показати всі категорії
            <span id="categories__all-link--arrow">→</span></a>
        </div>
      </section>

      <Footer/>
    </>
  );
};

export default MainPage;
