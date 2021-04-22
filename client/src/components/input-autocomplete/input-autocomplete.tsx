import React from 'react';

import './input-autocomplete.scss';
import Form from 'react-bootstrap/Form';

type Suggestion = {
  text: string,
  group?: string,
  value: string | number,
}

type Props = {
  inputName: string,
  selectName: string,
  disabled?: boolean,
  className?: string,
  placeholder: string,
  suggestions: Array<Suggestion>,
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
        suggestions.length + 2 :
        5
    );

  const suggestionGroup: { [k: string]: Array<Suggestion> } = {};
  suggestions.forEach((element) => {
    const group = element.group || '';

    if (suggestionGroup[group]) {
      return suggestionGroup[group].push(element);
    }

    suggestionGroup[group] = [element];
  });

  const suggestionArray = Object.entries(suggestionGroup);

  const renderElements = <T extends {
    text: string,
    value: string | number,
  }>(list: T[]) => {
    return list.map((suggestion, i) => {
      const {text, value} = suggestion;
      return <option key={text + i} value={value}>{text}</option>;
    });
  };

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
          (suggestionArray.length > 1 || suggestionArray[0]?.[0] !== '') ?
            suggestionArray.map(([group, elements]) =>
              <optgroup label={group} key={group}>
                {renderElements<Suggestion>(elements)}
              </optgroup>,
            ) :
            renderElements<Suggestion>(suggestions)
        }
      </Form.Control>
    </span>
  );
};

export default InputAutocomplete;
