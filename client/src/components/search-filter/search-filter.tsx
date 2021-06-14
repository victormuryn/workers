import React, {useEffect, useState} from 'react';
import {ActionMeta, OptionsType} from 'react-select';
import api from '../../utils/api';

import {useForm} from '../../hooks/form.hook';

import './search-filter.scss';

import InputAutocomplete from '../input-autocomplete';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


type Location = {
  _id: string,
  city: string,
  district: string,
  region: string,
  latitude: number,
  longitude: number,
}

type Autofill = {
  label: string,
  group?: string,
  value: any,
};

interface SuggestionState {
  categories: Autofill[],
  location: Autofill[],
}

interface LoadingState {
  categories: boolean,
  location: boolean,
}

type Category = {
  _id: string,
  title: string,
  url: string,
  group?: string,
};

interface FormState {
  categories: string[],
  location: [],
  remote: boolean,
  hot: boolean,
  _categoriesValues: Autofill[],
  _locationValues: Autofill[],
}

interface State {
  onSubmit: (data: FormState) => void,
}

const SearchFilter: React.FC<State> = ({onSubmit}) => {
  const [suggestion, setSuggestions] = useState<SuggestionState>({
    categories: [],
    location: [],
  });

  const [loading, setLoading] = useState<LoadingState>({
    categories: false,
    location: false,
  });

  const initialForm: FormState = {
    categories: [],
    _categoriesValues: [],
    location: [],
    _locationValues: [],
    remote: false,
    hot: false,
  };

  const {
    form,
    setForm,
    resetForm,
    inputChangeHandler,
  } = useForm<FormState>(initialForm);

  useEffect(() => {
    const stringifiedForm = localStorage.getItem(`searchFilter`);

    if (stringifiedForm) {
      try {
        const form = JSON.parse(stringifiedForm) as FormState;
        setForm(form);
      } catch (e) {}
    }
  }, []);

  const cityInputChangeEvent = (
    text: string,
    options: {
      action: 'set-value' | 'input-change' | 'input-blur' | 'menu-close',
    },
  ) => {
    if (options.action !== `input-change`) return;

    if (!text) {
      return setSuggestions((prevState) => ({
        ...prevState,
        location: [],
      }));
    }

    setLoading((prev) => ({
      ...prev,
      location: true,
    }));

    api
      .get<Location[]>(`/project/city/${text}`)
      .then(({data}) => {
        const suggestionsList = data.map((value) => {
          const {city, district, region, _id} = value;

          return {
            value: _id,
            label: `${city}, ${district}, ${region}`,
          };
        });

        setSuggestions((prevState) => ({
          ...prevState,
          location: suggestionsList,
        }));

        setLoading((prevState) => ({
          ...prevState,
          location: false,
        }));
      })
      .catch((error) => {})
      .then(() => {
        setLoading((prevState) => ({
          ...prevState,
          categories: false,
        }));
      });
  };

  const selectChangeHandler = (
    value: Autofill | OptionsType<Autofill> | null,
    options: ActionMeta<Autofill>,
  ) => {
    if (options.action === `clear`) {
      const name = options.name || ``;
      const value: [] = [];

      return inputChangeHandler([{
        name, value,
      }, {
        value, name: `_${name}Values`,
      }]);
    }

    if (!value) return;

    const name = options.name || ``;
    if (Array.isArray(value)) {
      const values = value.map((element) => element.value);

      return inputChangeHandler([{
        name, value: values,
      }, {
        value, name: `_${name}Values`,
      }]);
    }

    inputChangeHandler([{
      name, value: (value as Autofill).value,
    }, {
      value, name: `_${name}Values`,
    }]);
  };

  const categoryInputChangeHandler = (
    text: string,
    options: {
      action: 'set-value' | 'input-change' | 'input-blur' | 'menu-close',
    },
  ) => {
    if (options.action !== `input-change`) return;

    if (!text) {
      return setSuggestions((prevState) => ({
        ...prevState,
        categories: [],
      }));
    }

    setLoading((prevState) => ({
      ...prevState,
      categories: true,
    }));

    api
      .get<Category[]>(`/categories/autofill/${text}`)
      .then(({data}) => {
        const response = data.map(({group, _id: value, title: label}) => ({
          label, group, value,
        }));

        setSuggestions((prevState) => ({
          ...prevState,
          categories: response,
        }));
      })
      .catch((error) => {})
      .then(() => {
        setLoading((prevState) => ({
          ...prevState,
          categories: false,
        }));
      });
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(form);
  };

  const resetHandler = () => {
    resetForm();
    onSubmit(initialForm);
  };

  return (
    <Form onSubmit={submitHandler} onReset={resetHandler} className="mb-4">
      <Form.Group className="mx-auto mb-3" controlId="category">
        <Form.Label>Категорії</Form.Label>
        <InputAutocomplete
          isMulti
          name="categories"
          loading={loading.categories}
          value={form._categoriesValues}
          placeholder="Виберіть категорії"
          suggestions={suggestion.categories}
          onSelectChange={selectChangeHandler}
          onInputChange={categoryInputChangeHandler}
        />
      </Form.Group>

      <Form.Group className="mx-auto mb-3" controlId="location">
        <Form.Label>Міста</Form.Label>
        <InputAutocomplete
          isMulti
          name="location"
          loading={loading.location}
          value={form._locationValues}
          placeholder="Населений пункт"
          suggestions={suggestion.location}
          onInputChange={cityInputChangeEvent}
          onSelectChange={selectChangeHandler}
        />
      </Form.Group>

      <Form.Group className="mx-auto mb-3" controlId="remote">
        <Form.Check
          name="remote"
          type="checkbox"
          checked={form.remote}
          label="Віддалена робота 🖥️"
          onChange={inputChangeHandler}
        />
      </Form.Group>

      <Form.Group className="mx-auto mb-3" controlId="only_hot">
        <Form.Check
          name="hot"
          type="checkbox"
          checked={form.hot}
          onChange={inputChangeHandler}
          label="Тільки термінові проєкти 🔥"
        />
      </Form.Group>

      <Row>
        <Col xs={{
          'offset': 2,
          'span': 4,
        }}>
          <Button variant="outline-secondary" type="reset">
            Скинути
          </Button>
        </Col>

        <Col xs={{
          'span': 4,
        }}>
          <Button variant="primary" type="submit">Знайти</Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchFilter;
