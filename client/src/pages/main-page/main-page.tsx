import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import TypoAnimation from '../../components/typo-animation';
import Footer from '../../components/footer';

import './main-page.scss';

import AOS from 'aos';
import 'aos/dist/aos.css';
import {setPageMeta} from '../../utils/utils';

const MainPage: React.FC = () => {
  setPageMeta(`Головна`);

  const phrases = [
    `спеціаліста`,
    `роботу`,
  ];

  useEffect(() => {
    AOS.init({
      once: true,
      delay: 200,
      offset: 200,
      duration: 1200,
      disable: 'mobile',
    });
  }, []);

  return (
    <>
      <header className="header">
        <Container>
          <div className="header__line">
            <h2 className="header__logo"><a href="/">Workers</a></h2>

            <div className="header__btns-wrapper">
              <Button
                as={Link}
                to="/auth"
                variant="success"
                className="header__btn"
              >
                Реєстрація
              </Button>

              <Button
                as={Link}
                to="/login"
                variant="primary"
                className="header__btn"
              >
                Увійти
              </Button>
            </div>
          </div>

          <div className="header__main-text">
            <h1 className="header__title">
              Шукаєш <TypoAnimation phrases={phrases} />?
            </h1>

            <div className="header__btns-wrapper">
              <Link to="#">
                <Button variant="success" className="header__main-btn
                header__btn header__main-btn--get-master">
                  Знайти спеціаліста
                </Button>
              </Link>

              <Link to="#">
                <Button variant="success" className="header__main-btn
                header__btn header__main-btn--get-work">
                  Знайти роботу
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </header>

      <Container className="why text-center" as="section">
        <h2 className="why__title">Чому саме ми?</h2>

        <Row>
          <Col xs={12} md={4}>
            <div className="why__item-img-wrapper">
              <img src="/img/one.svg" alt="№1 у світі"
                className="why__item-img"/>
            </div>

            <h5 className="why__item-title">Унікальний сервіс</h5>
            <p className="why__item-text">На сьогодні наш сервіс має найбільшу
              базу клієнтів та немає аналогів у всьому
              світі, тому тобі швидко вдасться знайти потрібного фахівця!</p>
          </Col>
          <Col xs={12} md={4}>
            <div className="why__item-img-wrapper">
              <img src="/img/worker.svg" alt="Перевірений професіонал"
                className="why__item-img"/>
            </div>

            <h5 className="why__item-title">Величезна кількість
              робітників</h5>
            <p className="why__item-text">Понад 1000 професіоналів готові
              допомогти тобі у будь-який момент. Усі
              спеціалісти проходять обов&apos;язкову перевірку, щоб ти був
              впевнений у якості роботи.</p>
          </Col>
          <Col xs={12} md={4}>
            <div className="why__item-img-wrapper">
              <img src="/img/plane.svg" alt="Захист"
                className="why__item-img"/>
            </div>

            <h5 className="why__item-title">100% надійно</h5>
            <p className="why__item-text">Перед початком роботи гроші
              резервуються, щоб ти був переконаний в успішному
              завершенні проєкту. У разі, якщо робота не буде виконана — ми
              вернемо гроші!</p>
          </Col>
        </Row>
      </Container>

      <Container
        as="section"
        data-aos="fade-up"
        className="custom text-center"
      >
        <h2 className="custom__title">Працюємо так, як зручно тобі</h2>

        <picture>
          <source srcSet="/img/work.webp, /img/work@2x.webp 2x"
            type="image/webp"/>
          <source srcSet="/img/work.jpg, /img/work@2x.jpg 2x"
            type="image/jpeg"/>
          <img src="/img/work.jpg" alt="Стараємося для Вас"
            className="custom__img"/>
        </picture>

        <p className="custom__text">Резервація грошей, гнучка система роботи,
          простота, швидка технічна підтримка: усе,
          що потрібно для комфортної співпраці!</p>
      </Container>

      <Container as="section" className="how-it-works" fluid={true}>
        <h2 className="how-it-works__title">Робота у 5 простих кроків</h2>

        <ol className="how-it-works__list">
          <li
            data-aos="slide-left"
            className="how-it-works__item how-it-works__item--create"
          >
            <h4 className="how-it-works__item-title">1 Створіть проєкт</h4>
            <p className="how-it-works__item-text">Детально опишіть завдання та
              побажання для виконавців</p>
          </li>

          <li
            data-aos="slide-right"
            className="how-it-works__item how-it-works__item--choose"
          >
            <h4 className="how-it-works__item-title">2 Виберіть виконавця</h4>
            <p className="how-it-works__item-text">Оберіть виконавця за ціною,
              термінами, відгуками та портфоліо</p>
          </li>

          <li
            data-aos="slide-left"
            className="how-it-works__item how-it-works__item--reserve"
          >
            <h4 className="how-it-works__item-title">3 Зарезервуйте кошти</h4>
            <p className="how-it-works__item-text">Після вибору, зарезервуйте
              кошти та розпочніть роботу з
              виконавцем</p>
          </li>

          <li
            data-aos="slide-right"
            className="how-it-works__item how-it-works__item--follow"
          >
            <h4 className="how-it-works__item-title">4 Слідкуйте за ходом
              роботи</h4>
            <p className="how-it-works__item-text">Відстежуйте виконання роботи,
              контролюйте деталі у чаті з
              виконавцем</p>
          </li>

          <li
            data-aos="slide-left"
            className="how-it-works__item how-it-works__item--reviews"
          >
            <h4 className="how-it-works__item-title">5 Завершіть виконаний
              проєкт</h4>
            <p className="how-it-works__item-text">Після закінчення роботи
              підтвердіть виконання та обміняйтеся
              відгуками</p>
          </li>

          <li
            data-aos="slide-right"
            className="how-it-works__item how-it-works__item--done"
          >
            <div className="visually-hidden">Кінець</div>
          </li>
        </ol>
      </Container>

      <Container as="section" className="categories">
        <h2 className="categories__title">Найпопулярніші категорії</h2>

        <Row lg={5} data-aos="fade-up">
          <Col xs={12} sm={6} lg={false} className="categories__item">
            <Link to="/category/plumbing">
              <img src="/img/pipeline.svg" alt="Сантехніка"
                className="categories__item-img"/>
              <h5 className="categories__item-title"> Сантехніка</h5>
            </Link>
          </Col>

          <Col xs={12} sm={6} lg={false} className="categories__item">
            <Link to="/category/electricity">
              <img src="/img/plug.svg" alt="Електрика"
                className="categories__item-img"/>
              <h5 className="categories__item-title">Електрика</h5>
            </Link>
          </Col>

          <Col xs={12} sm={6} lg={false} className="categories__item">
            <Link to="/category/delivery">
              <img src="/img/delivery.svg" alt="Доставка"
                className="categories__item-img"/>
              <h5 className="categories__item-title">Доставка</h5>
            </Link>
          </Col>

          <Col xs={12} sm={6} lg={false} className="categories__item">
            <Link to="/category/car-service">
              <img src="/img/service.svg" alt="Автосервіс"
                className="categories__item-img"/>
              <h5 className="categories__item-title">Автосервіс</h5>
            </Link>
          </Col>

          <Col xs={12} sm={6} lg={false} className="categories__item">
            <Link to="/category/repair">
              <img src="/img/paint-bucket.svg" alt="Ремонт"
                className="categories__item-img"/>
              <h5 className="categories__item-title">Ремонт</h5>
            </Link>
          </Col>

          <Col xs={12} sm={6} lg={false} className="categories__item">
            <Link to="/category/learning">
              <img src="/img/book.svg" alt="Навчання"
                className="categories__item-img"/>
              <h5 className="categories__item-title">Навчання</h5>
            </Link>
          </Col>

          <Col xs={12} sm={6} lg={false} className="categories__item">
            <Link to="/category/it">
              <img src="/img/it.svg" alt="IT-послуги"
                className="categories__item-img"/>
              <h5 className="categories__item-title">IT-послуги</h5>
            </Link>
          </Col>

          <Col xs={12} sm={6} lg={false} className="categories__item">
            <Link to="/category/photosession">
              <img src="/img/camera.svg" alt="Фотосесії"
                className="categories__item-img"/>
              <h5 className="categories__item-title">Фотосесії</h5>
            </Link>
          </Col>

          <Col xs={12} sm={6} lg={false} className="categories__item">
            <Link to="/category/cleaning">
              <img src="/img/cleaning.svg" alt="Прибирання"
                className="categories__item-img"/>
              <h5 className="categories__item-title">Прибирання</h5>
            </Link>
          </Col>

          <Col xs={12} sm={6} lg={false} className="categories__item">
            <Link to="/category/others">
              <img src="/img/other.svg" alt="Інше"
                className="categories__item-img"/>
              <h5 className="categories__item-title">Інше</h5>
            </Link>
          </Col>
        </Row>

        <div className="categories__link-wrapper">
          <a href="#" className="categories__all-link link-success">
            Показати всі категорії
            <span id="categories__all-link--arrow">→</span></a>
        </div>
      </Container>

      <Footer />
    </>
  );
};

export default MainPage;
