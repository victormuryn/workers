import React from 'react';
import {Link} from 'react-router-dom';

import './footer.scss';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

type FooterProps = {
  color?: string;
}

const Footer: React.FC<FooterProps> = ({color = `#fff`}) => {
  const background = `linear-gradient(
      179deg,
      transparent 0,
      transparent 45px,
      ${color} 45px,
      ${color} 100%
    )`;
  return (
    <Container className="footer" fluid style={{background}} as="footer">
      <Row xs={1} md={3} className="footer__wrapper">
        <Col md={{
          span: 12,
          order: `last`,
        }} className="footer__column">
          <h2 className="footer__logo"><Link to="/">Workers</Link></h2>
          <p className="footer__copy">
            © 2021 workers.com.ua — всі права захищені
          </p>
        </Col>

        <Col className="footer__column">
          <a href="#">Реклама на сайті</a>
          <a href="#">Зв&apos;язатися з адміністрацією</a>
        </Col>

        <Col className="footer__column">
          <a href="#">Угода користувача</a>
          <a href="#">Допомога</a>
        </Col>

        <Col className="footer__column">
          <a href="#">Замовники</a>
          <a href="#">Виконавці</a>
          {/* <a href="#">Блог</a>*/}
          <a href="#">Безпечна угода</a>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
