import React from 'react';
import PropTypes from 'prop-types';

import './input-group.scss';

const InputGroup = (props) => {
  const {label, name, onChange, required = true,
    value=``, type=`text`, pattern, refProp,
    minLength, maxLength, placeholder} = props;

  return (
    <label className="auth-form__label">
      <span className="auth-form__label-text">{label}</span>

      <div className="auth-page__input-group">
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
      </div>
    </label>
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
