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

type Location = {
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
  category: string,
  inputCity: string,
  location: Location,
  description: string,
  categoryText: string,
};

type Categories = {
  _id: string,
  title: string,
  url: string,
  group?: string,
};

type Autofill = {
  text: string,
  value: string | number,
};

type AutofillChangeType<T> = [
  React.ChangeEvent<HTMLInputElement>,
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
    category: ``,
    remote: false,
    inputCity: ``,
    description: ``,
    categoryText: ``,
    location: {city: ``, district: ``, region: ``, latitude: 0, longitude: 0},
  });

  const inputChangeHandlerByValue = (value: any, name: string) => {
    inputChangeHandler({name, value});
  };

  const selectChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {name} = e.target;
    const inputName = e.target.dataset.inputName || `none`;

    const nativeTarget = e.nativeEvent.target as HTMLSelectElement;

    const index = nativeTarget.selectedIndex || -1;
    const text = nativeTarget[index].textContent || `Пусто`;

    let value: any;
    try {
      value = JSON.parse(e.target.value);
    } catch (error) {
      value = e.target.value;
    }

    setSuggestions([]);
    setCatSuggestions([]);

    inputChangeHandler([{
      name: inputName,
      value: text,
    }, {
      name,
      value,
    }]);
  };

  const onAutofillChange = async <T, >(...args: AutofillChangeType<T>) => {
    const [e, url, onSuccess] = args;
    inputChangeHandler(e);

    api
      .get<T[]>(`${url}${e.target.value}`)
      .then(({data}) => {
        onSuccess(data);
      })
      .catch((error) => {
        setError(error);
      });
  };

  const categoryInputChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    await onAutofillChange<Categories>(
      event,
      `/categories/autofill/`,
      (result) => {
        const response = result.map(({group, _id, title: text}) => ({
          text,
          group,
          value: _id,
        }));

        setCatSuggestions(response);
      });
  };

  const cityInputChangeEvent = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.value) {
      inputChangeHandler(event);
      setSuggestions([]);
      return;
    }

    await onAutofillChange<Location>(
      event,
      `/project/city/`,
      (result) => {
        const suggestionsList = result.map((element) => {
          const {
            city, district, region,
            latitude, longitude,
          } = element;
          const value = JSON.stringify({
            city, district, region, latitude, longitude,
          });

          return {
            text: `${city}, ${district}, ${region}`,
            value,
          };
        });

        setSuggestions(suggestionsList);
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
            selectName="category"
            placeholder="Категорія"
            inputName="categoryText"
            value={form.categoryText}
            suggestions={catSuggestions}
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
            selectName="location"
            inputName="inputCity"
            value={form.inputCity}
            disabled={form.remote}
            suggestions={suggestions}
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
                  name: `inputCity`,
                  value: ``,
                }, {
                  name: `location`,
                  value: {
                    city: ``, district: ``, region: ``,
                    latitude: 0, longitude: 0,
                  },
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
