import React from 'react';

import './edit-project.scss';

import {useForm} from '../../hooks/form.hook';
import Form from 'react-bootstrap/Form';

// @ts-ignore
import {CKEditor} from '@ckeditor/ckeditor5-react';
// @ts-ignore
import ClassicEditor from '../../libs/ckeditor/ckeditor.js';
import '@ckeditor/ckeditor5-build-classic/build/translations/uk';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Button} from 'react-bootstrap';

interface Form {
  title: string,
  description: string,
  price: number | undefined,
}

interface Props {
  title: string
  description: string
  price: number | undefined
  onSubmit: (form: Form) => void
}

const EditProject: React.FC<Props> = (props) => {
  const {title, description, price, onSubmit} = props;
  const {form, inputChangeHandler} = useForm<Form>({title, description, price});

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <Form onSubmit={submitHandler}>
      <Form.Group as={Row} controlId="form-text">
        <Form.Label column sm="2">Заголовок:</Form.Label>
        <Col sm="10">
          <Form.Control
            required
            type="text"
            name="title"
            value={form.title}
            onChange={inputChangeHandler}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="form-text">
        <Form.Label column sm="2">Ціна:</Form.Label>
        <Col sm="10">
          <Form.Control
            min={200}
            name="price"
            type="number"
            value={form.price}
            placeholder="У гривнях"
            style={{maxWidth: `40%`}}
            onChange={inputChangeHandler}
          />
          <small className="text-muted">
            Якщо не впевненні у вартості — залиште поле пустим
          </small>
        </Col>
      </Form.Group>


      <Form.Group as={Row} controlId="form-text">
        <Form.Label column sm="2">Опис:</Form.Label>
        <Col sm="10">
          <CKEditor
            name="description"
            editor={ClassicEditor}
            data={form.description}
            config={{
              toolbar: [`heading`, `|`,
                `bold`, `italic`, `link`, `blockQuote`, `|`,
                `bulletedList`, `numberedList`, `indent`, `outdent`, `|`,
                'undo', 'redo',
              ],
              placeholder: `Опишіть детально вашу проблему...`,
              language: `uk`,
              link: {
                decorators: {
                  addTargetToExternalLinks: {
                    mode: 'automatic',
                    callback: (url: string) => url,
                    attributes: {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    },
                  },
                },
              },
            }}
            onChange={
              (event: any, editor: any) => {
                inputChangeHandler({
                  name: `description`,
                  value: editor.getData(),
                });
              }
            }
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="form-text">
        <Form.Label column sm="2" />
        <Col sm="10">
          <Button type="submit" variant="success">Оновити</Button>
        </Col>
      </Form.Group>
    </Form>
  );
};

export default EditProject;
