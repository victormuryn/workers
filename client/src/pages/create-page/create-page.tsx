import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {useForm} from '../../hooks/form.hook';
import api from '../../utils/api';

import './create-page.scss';

import Message from '../../components/message';
import CreateFormGroup from '../../components/create-form-group';
import InputAutocomplete from '../../components/input-autocomplete';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

// @ts-ignore
import {CKEditor} from '@ckeditor/ckeditor5-react';
// @ts-ignore
import ClassicEditor from '../../libs/ckeditor/ckeditor.js';
import '@ckeditor/ckeditor5-build-classic/build/translations/uk';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Types
import {State} from '../../redux/reducer';
import {setPageMeta} from '../../utils/utils';
import {ActionMeta, OptionsType} from 'react-select';

type Location = {
  _id: string,
  city: string,
  district: string,
  region: string,
  latitude: number,
  longitude: number,
}

type FormState = {
  hot: boolean,
  expire: Date,
  title: string,
  price: number,
  remote: boolean,
  category: string[],
  location: string | null,
  description: string,
};

type Categories = {
  _id: string,
  title: string,
  url: string,
  group?: string,
};

type Autofill = {
  label: string,
  group?: string,
  value: any,
};

type AutofillChangeType<T> = [
  string,
  string,
  (data: T[]) => void,
]

const CreatePage: React.FC = () => {
  setPageMeta(`Створити проєкт`);
  const user = useSelector((state: State) => state.user);

  const history = useHistory();
  if (user.accountType !== `client`) {
    history.goBack();
    return <div/>;
  }

  const [error, setError] = useState<string>(``);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputLoading, setInputLoading] = useState<{
    city: boolean,
    category: boolean,
  }>({
    city: false,
    category: false,
  });
  const clearError = () => setError(``);

  const [catSuggestions, setCatSuggestions] = useState<Autofill[]>([]);
  const [suggestions, setSuggestions] = useState<Autofill[]>([]);

  const initialExpire = new Date();
  const expire = new Date((initialExpire).setDate(initialExpire.getDate() + 7));

  const now = new Date();
  const {form, inputChangeHandler} = useForm<FormState>({
    expire,
    price: 0,
    title: ``,
    hot: false,
    category: [],
    remote: false,
    description: ``,
    location: null,
  });

  const inputChangeHandlerByValue = (value: any, name: string) => {
    inputChangeHandler({name, value});
  };

  const selectChangeHandler = (
    value: Autofill | OptionsType<Autofill> | null,
    options: ActionMeta<Autofill>,
  ) => {
    if (options.action === `clear`) {
      return inputChangeHandler({
        name: options.name || ``,
        value: undefined,
      });
    }

    if (!value) return;

    if (Array.isArray(value)) {
      const values = value.map((element) => element.value);

      return inputChangeHandler({
        name: options.name || ``,
        value: values,
      });
    }

    inputChangeHandler({
      name: options.name || ``,
      value: (value as Autofill).value,
    });
  };

  const onAutofillChange = <T, >(...args: AutofillChangeType<T>) => {
    const [text, url, onSuccess] = args;

    api
      .get<T[]>(`${url}${text}`)
      .then(({data}) => {
        onSuccess(data);
      })
      .catch((error) => {
        setError(error);
      });
  };

  const categoryInputChangeHandler = (
    text: string,
    options: {
      action: 'set-value' | 'input-change' | 'input-blur' | 'menu-close',
    },
  ) => {
    if (options.action !== `input-change`) return;

    if (!text) {
      setCatSuggestions([]);
      return;
    }

    setInputLoading((prev) => ({
      ...prev,
      category: true,
    }));

    onAutofillChange<Categories>(
      text,
      `/categories/autofill/`,
      (result) => {
        const response = result.map(({group, _id, title: label}) => ({
          label, group, value: _id,
        }));

        setCatSuggestions(response);
        setInputLoading((prev) => ({
          ...prev,
          category: false,
        }));
      });
  };

  const cityInputChangeEvent = (
    text: string,
    options: {
      action: 'set-value' | 'input-change' | 'input-blur' | 'menu-close',
    },
  ) => {
    if (options.action !== `input-change`) return;

    if (!text) {
      setSuggestions([]);
      return;
    }

    setInputLoading((prev) => ({
      ...prev,
      city: true,
    }));

    onAutofillChange<Location>(
      text,
      `/project/city/`,
      (result) => {
        const suggestionsList = result.map((value) => {
          const {city, district, region, _id} = value;

          return {
            value: _id,
            label: `${city}, ${district}, ${region}`,
          };
        });

        setSuggestions(suggestionsList);
        setInputLoading((prev) => ({
          ...prev,
          city: false,
        }));
      });
  };

  const formSubmitHandler = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const date = new Date();

    setLoading(true);
    api
      .post<{ id: string }>(`/project/create`, {...form, date}, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      })
      .then(({data}) => {
        history.push(`/project/${data.id}`);
      })
      .catch((error) => {
        setError(error.response.data.message ||
          `Щось пішло не так, спробуйте знову.`);
      })
      .then(() => {
        setLoading(false);
      });
  };

  return (
    <Container className="mt-5 pt-5">
      <h1 className="text-center mt-5 mb-5 pb-5">Створити проєкт</h1>

      {error && <Message text={error} onClose={clearError} type="danger"/>}

      <Form method="POST" onSubmit={formSubmitHandler}>
        {/* title */}
        <CreateFormGroup title="Назва проєкту">
          <Form.Control
            required
            type="text"
            name="title"
            value={form.title}
            onChange={inputChangeHandler}
          />
        </CreateFormGroup>

        {/* description */}
        <CreateFormGroup title="Опис">
          <CKEditor
            name="description"
            editor={ClassicEditor}
            config={{
              toolbar: [`heading`, `|`,
                `bold`, `italic`, `link`, `blockQuote`, `|`,
                `bulletedList`, `numberedList`, `indent`, `outdent`, `|`,
                'undo', 'redo',
              ],
              placeholder: `Опишіть детально вашу проблему...`,
              language: `uk`,
            }}
            onChange={
              (event: any, editor: any) => {
                inputChangeHandlerByValue(editor.getData(), `description`);
              }
            }
          />
        </CreateFormGroup>

        {/* price */}
        <CreateFormGroup title="Бюджет (у гривнях)" lg={3}>
          <Form.Control
            min={200}
            name="price"
            type="number"
            onChange={inputChangeHandler}
          />
          <small className="text-muted">
            Якщо не впевнені у вартості - залиште поле пустим
          </small>
        </CreateFormGroup>

        {/* category */}
        <CreateFormGroup title="Вкажіть категорію" lg={3}>
          <InputAutocomplete
            isMulti
            name="category"
            placeholder="Категорія"
            suggestions={catSuggestions}
            loading={inputLoading.category}
            onSelectChange={selectChangeHandler}
            onInputChange={categoryInputChangeHandler}
          />
        </CreateFormGroup>

        {/* expire */}
        <CreateFormGroup title="Активний до">
          <DatePicker
            name="expire"
            minDate={new Date()}
            selected={form.expire}
            className="form-control"
            onChange={(date) => {
              inputChangeHandlerByValue(date, `expire`);
            }}
            maxDate={new Date(now.setMonth(now.getMonth() + 1))}
          />
        </CreateFormGroup>

        {/* city */}
        <CreateFormGroup title="Вкажіть місто" lg={3}>
          <InputAutocomplete
            name="location"
            disabled={form.remote}
            suggestions={suggestions}
            loading={inputLoading.city}
            placeholder="Населений пункт"
            onInputChange={cityInputChangeEvent}
            onSelectChange={selectChangeHandler}
          />
          <Form.Label>або</Form.Label>
          <Form.Check
            custom
            id="remote"
            name="remote"
            type="checkbox"
            checked={form.remote}
            label="Віддалена робота"
            onChange={(event) => {
              setSuggestions([]);
              inputChangeHandler([
                event,
                {
                  name: `location`,
                  value: null,
                },
              ]);
            }}
          />
        </CreateFormGroup>

        {/* hot */}
        <CreateFormGroup title="Потрібно терміново?" lg={3}>
          <Form.Check
            custom
            id="hot"
            name="hot"
            type="checkbox"
            checked={form.hot}
            className="text-muted small"
            onChange={inputChangeHandler}
            label="ми знайдемо виконавців для вашого проєкту якнайшвидше"
          />
        </CreateFormGroup>

        {/* submit */}
        <Form.Group as={Row} className="mt-5">
          <Col sm={{span: 10, offset: 2}}>
            <Button
              size="lg"
              type="submit"
              variant="success"
              disabled={loading}
            >
              Опублікувати проєкт
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default CreatePage;
