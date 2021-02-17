import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {useHttp} from '../../hooks/http.hook';

import './create-page.scss';

import Message from '../../components/message/message';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/uk';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreatePage = () => {
  const user = useSelector((state) => state.user);

  const history = useHistory();
  if (user.accountType !== `client`) {
    history.goBack();
  }

  const {request, loading, error, clearError} = useHttp();

  const initialExpire = new Date();
  const now = new Date();
  const [form, setForm] = useState({
    title: ``,
    description: ``,
    price: 0,
    expire: initialExpire.setDate(initialExpire.getDate() + 7),
  });

  const inputChangeHandler = (event) => {
    const {name, value} = event.target;

    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    const date = new Date();

    const response = await request(`/api/project/create`, `POST`,
      {...form, date}, {
        'Authorization': `Bearer ${user.token}`,
      });

    if (response) {
      history.push(`/project/${response.id}`);
    }
  };

  return (
    <Container className="mt-5 pt-5">
      <h1 className="text-center mt-5 mb-5 pb-5">Створити проєкт</h1>

      {error && <Message text={error} onClose={clearError} type="danger"/>}

      <Form method="POST" onSubmit={formSubmitHandler}>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column lg={{
            span: 2,
            offset: 2,
          }}>
            Назва проєкту
          </Form.Label>
          <Col lg={6}>
            <Form.Control
              required
              type="text"
              name="title"
              value={form.title}
              onChange={inputChangeHandler}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column lg={{
            span: 2,
            offset: 2,
          }}>
            Опис
          </Form.Label>
          <Col lg={6}>
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
              onChange={(event, editor) => {
                event.target = {
                  name: `description`,
                  value: editor.getData(),
                };
                inputChangeHandler(event);
              }}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column lg={{
            span: 2,
            offset: 2,
          }}>
            Бюджет (у гривнях)
          </Form.Label>
          <Col lg={3}>
            <Form.Control
              min={200}
              name="price"
              type="number"
              onChange={inputChangeHandler}
            />
            <small className="text-muted">
              Якщо не впевнені у вартості - залиште поле пустим
            </small>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column lg={{
            span: 2,
            offset: 2,
          }}>
            Активний до
          </Form.Label>
          <Col lg={3}>
            <DatePicker
              selected={form.expire}
              name="expire"
              minDate={new Date()}
              maxDate={new Date(now.setMonth(now.getMonth() + 1))}
              onChange={(date) => setForm((prevState) => ({
                ...prevState, expire: date,
              }))}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mt-5">
          <Col sm={{span: 10, offset: 2}}>
            <Button
              type="submit"
              size="lg"
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
