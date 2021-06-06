import React, {useEffect} from 'react';

import './chat-form.scss';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useForm} from '../../hooks/form.hook';

interface Props {
  disabled?: boolean,
  selectedUserID?: string | null,
  onMessageSubmit?: (text: string) => any,
}

const ChatForm: React.FC<Props> = ({
  disabled = false,
  onMessageSubmit = () => {},
  selectedUserID = null,
}) => {
  const initialForm = {
    text: ``,
  };

  const {form, inputChangeHandler, resetForm} = useForm<typeof initialForm>({
    ...initialForm,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.text.length > 0 && form.text.length <= 200) {
      onMessageSubmit(form.text);
      resetForm();
    }
  };

  useEffect(() => {
    resetForm();
  }, [selectedUserID]);

  return (
    <Form onSubmit={onSubmit} className="mt-3 mb-0">
      <fieldset disabled={disabled} className="chat-form">
        <Form.Control
          name="text"
          type="text"
          minLength={1}
          maxLength={200}
          value={form.text}
          autoComplete="off"
          onChange={inputChangeHandler}
          placeholder="Введіть повідомлення"
          className="border-0 py-4 bg-light me-4"
        />

        <Button type="submit" variant="primary">Відправити</Button>
      </fieldset>
    </Form>
  );
};

export default ChatForm;
