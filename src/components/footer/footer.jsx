import React from 'react';
import PropTypes from 'prop-types';

import './footer.scss';

const Footer = ({color = `#fff`}) => {
  const background = `linear-gradient(
      179deg,
      transparent 0,
      transparent 45px,
      ${color} 45px,
      ${color} 100%
    )`;

  return (
    <footer className="footer" style={{background}}>
      <div className="footer__wrapper">
        <div className="footer__column">
          <h2 className="footer__logo"><a href="/">Workers</a></h2>
          <p className="footer__copy">© 2021 workers.com.ua — всі права
            захищені</p>
        </div>

        <div className="footer__column">
          <a href="#">Реклама на сайті</a>
          <a href="#">Зв&apos;язатися з адміністрацією</a>
        </div>

        <div className="footer__column">
          <a href="#">Угода користувача</a>
          <a href="#">Допомога</a>
        </div>

        <div className="footer__column">
          <a href="#">Замовники</a>
          <a href="#">Виконавці</a>
          <a href="#">Блог</a>
          <a href="#">Безпечна угода</a>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  color: PropTypes.string,
};

export default Footer;
