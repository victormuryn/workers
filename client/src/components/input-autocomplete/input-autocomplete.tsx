import React from 'react';

import './input-autocomplete.scss';
import Select, {ActionMeta, OptionsType} from 'react-select';

type Suggestion = {
  label: string,
  group?: string,
  value: any,
}

type Props = {
  isMulti?: boolean,
  name?: string,
  loading?: boolean,
  disabled?: boolean,
  className?: string,
  placeholder: string,
  suggestions: Array<Suggestion>,
  value?: Suggestion | Suggestion[],
  onInputChange: (
    text: string,
    options: {
      action: 'set-value' | 'input-change' | 'input-blur' | 'menu-close',
    },
  ) => void,
  onSelectChange: (
    value: Suggestion | OptionsType<Suggestion> | null,
    options: ActionMeta<Suggestion>,
  ) => void,
}

const InputAutocomplete: React.FC<Props> = ({
  isMulti = false,
  loading = false,
  name,
  value,
  className,
  placeholder,
  suggestions,
  onInputChange,
  onSelectChange,
  disabled = false,
}) => {
  const suggestionGroup: {
    [k: string]: {
      label: string,
      options: Array<Suggestion>
    }
  } = {};
  suggestions.forEach((element) => {
    const group = element.group || '';

    if (suggestionGroup[group]) {
      return suggestionGroup[group].options.push(element);
    }

    suggestionGroup[group] = {
      label: group,
      options: [element],
    };
  });

  const suggestionArray = Object.values(suggestionGroup);

  return (
    <span className="autocomplete__wrapper m-0">
      <Select
        name={name}
        isClearable
        isSearchable
        value={value}
        isMulti={isMulti}
        isLoading={loading}
        isDisabled={disabled}
        classNamePrefix="select"
        options={suggestionArray}
        onChange={onSelectChange}
        placeholder={placeholder}
        onInputChange={onInputChange}
        className={`basic-multi-select ${className}`}
        noOptionsMessage={() => `Нічого не знайдено`}
      />
    </span>
  );
};

export default InputAutocomplete;
