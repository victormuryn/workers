import React, {useState} from 'react';

import './project-add-bet.scss';

import Button from 'react-bootstrap/Button';

import ProjectBetEditor from '../project-bet-editor';

type Props = {
  price: number
  onFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  inputChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

const ProjectAddBet: React.FC<Props> = ({
  inputChangeHandler,
  onFormSubmit,
  price,
}) => {
  const [showForm, setShowForm] = useState<boolean>(false);

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    onFormSubmit(e);
    setShowForm(false);
  };

  if (showForm) {
    return <div className="project__content">
      <ProjectBetEditor
        inputChangeHandler={inputChangeHandler}
        onFormSubmit={formSubmitHandler}
        price={price}
      />
    </div>;
  }

  return <div className="d-flex justify-content-center">
    <Button
      size="lg"
      className="mb-4"
      variant="success"
      onClick={() => setShowForm(true)}
    >
      Добавити ставку
    </Button>
  </div>;
};

export default ProjectAddBet;
