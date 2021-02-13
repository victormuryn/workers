import React from 'react';
import PropTypes from 'prop-types';

import './input-group.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const InputGroup = (props) => {
  const {
    label, name, onChange, required = true,
    value = ``, type = `text`, pattern, refProp,
    minLength, maxLength, placeholder,
  } = props;

  return (
    <Row as="label" className="auth-form__label">
      <Col
        as="span"
        className="auth-form__label-text mb-2"
        md={{
          span: 4,
          offset: 2,
        }}>
        {label}
      </Col>

      <Col className="position-relative mb-2" md={6} lg={3}>
        <div className="auth-page__input-underlined">
          <input
            type={type}
            name={name}
            required={required}
            minLength={minLength}
            maxLength={maxLength}
            onChange={onChange}
            pattern={pattern}
            value={value}
            ref={refProp}
          />
          <span className="auth-page__input-label">{placeholder}</span>
        </div>
      </Col>
    </Row>
  );
};

InputGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  pattern: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  required: PropTypes.bool,
  refProp: PropTypes.oneOfType([
    // Either a function
    PropTypes.func,
    // Or the instance of a DOM native element (see the note about SSR)
    PropTypes.shape({current: PropTypes.instanceOf(Element)}),
  ]),
};

export default InputGroup;
