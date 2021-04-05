import React from 'react';

import './create-form-group.scss';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

type Props = {
  title: string,
  lg?: number,
}

const CreateFormGroup: React.FC<Props> = ({title, lg = 6, children}) => {
  return (
    <Form.Group as={Row} className="mb-3">
      <Form.Label column lg={{
        span: 2,
        offset: 2,
      }}>
        {title}
      </Form.Label>
      <Col lg={lg} className="position-relative">
        {children}
      </Col>
    </Form.Group>
  );
};

export default CreateFormGroup;
