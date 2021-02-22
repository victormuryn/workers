import React from 'react';

import './input-group.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type InputGroupProps = {
  name: string,
  placeholder?: string,
  label?: string,
  pattern?: string,
  value?: string,
  type?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  minLength?: number,
  maxLength?: number,
  required?: boolean,
  refProp?: React.RefObject<HTMLInputElement>,
};

const InputGroup: React.FC<InputGroupProps> = (props) => {
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

export default InputGroup;
