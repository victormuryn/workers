import React from 'react';

import './input-autocomplete.scss';
import Form from 'react-bootstrap/Form';

type Props = {
  inputName: string,
  selectName: string,
  disabled?: boolean,
  className?: string,
  placeholder: string,
  suggestions: Array<{
    text: string,
    value: string | number,
  }>,
  value: string | number | undefined,
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
}

const InputAutocomplete: React.FC<Props> = ({
  inputName,
  selectName,
  value,
  className,
  placeholder,
  suggestions,
  onInputChange,
  onSelectChange,
  disabled = false,
}) => {
  const htmlSize = suggestions.length &&
    (
      suggestions.length < 5 ?
        suggestions.length + 1:
        5
    );

  return (
    <span className="autocomplete__wrapper m-0">
      <Form.Control
        type="text"
        value={value}
        name={inputName}
        disabled={disabled}
        onChange={onInputChange}
        placeholder={placeholder}
        className={`autocomplete__input ${className}`}
      />
      <Form.Control
        value={``}
        as="select"
        name={selectName}
        disabled={disabled}
        htmlSize={htmlSize}
        onChange={onSelectChange}
        data-input-name={inputName}
        className={!suggestions.length ? `autocomplete__select` : undefined}
      >
        <option value="" disabled>{placeholder}</option>
        {
          suggestions.map((suggestion, i) =>
            <option
              key={suggestion.text + i}
              value={suggestion.value}
            >
              {suggestion.text}
            </option>,
          )
        }
      </Form.Control>
    </span>
  );
};

export default InputAutocomplete;
