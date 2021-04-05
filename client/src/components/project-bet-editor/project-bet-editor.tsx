import React from 'react';

import './project-bet-editor.scss';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

type Props = {
  price: number
  onFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  inputChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void,
  value?: {
    text: string,
    term: number,
    price: number,
  }
}

const ProjectBetEditor: React.FC<Props> = ({
  inputChangeHandler,
  onFormSubmit,
  price,
  value,
}) => {
  return (
    <Form
      method="POST"
      onSubmit={onFormSubmit}
    >
      <Form.Group as={Row} controlId="form-text">
        <Form.Label column sm="2">Опис:</Form.Label>
        <Col sm="10">
          <Form.Control
            rows={5}
            required
            name="text"
            as="textarea"
            onChange={inputChangeHandler}
            placeholder="Опишіть, чому саме Ви"
            value={value ? value.text : undefined}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="form-price">
        <Form.Label column sm="2">Термін:</Form.Label>
        <Col sm="4">
          <Form.Control
            min={1}
            required
            name="term"
            type="number"
            onChange={inputChangeHandler}
            value={value ? value.term : undefined}
          />
          <small className="text-muted">
            Термін виконання проєкту у днях
          </small>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="form-price">
        <Form.Label column sm="2">Ціна:</Form.Label>
        <Col sm="3">
          <Form.Control
            required
            name="price"
            type="number"
            min={price || 200}
            placeholder="У гривнях"
            onChange={inputChangeHandler}
            value={value ? value.price : undefined}
          />
        </Col>
      </Form.Group>

      <Button variant="success" type="submit">Опублікувати</Button>
    </Form>
  );
};

export default ProjectBetEditor;
