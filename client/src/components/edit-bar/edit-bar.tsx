import React, {useState} from 'react';

import './edit-bar.scss';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface Props {
  modalTitle?: string,
  modalText: string,
  showEdit?: boolean;
  showDelete?: boolean;
  onDelete?: (event: React.MouseEvent) => void;
  onEdit?: (event: React.MouseEvent) => void;
}

const EditBar: React.FC<Props> = ({
  modalTitle = `Ви дійсно хочете видалити?`,
  modalText,
  onDelete = () => {},
  onEdit= () => {},
  showEdit = true,
  showDelete = true,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const deleteHandler = (event: React.MouseEvent) => {
    setShowModal(false);
    onDelete(event);
  };

  return (
    <>
      <div className="mt-3 d-flex align-content-center justify-content-end">
        {
          showEdit && <div className="ms-2 badge-wrapper">
            <Button
              title="Редагувати"
              variant="outline-success"
              onClick={onEdit}
            >
              <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"
                className="delete-icon">
                <use href="#icon-edit"/>
              </svg>
            </Button>
          </div>
        }

        {
          showDelete && <div className="ms-2 badge-wrapper">
            <Button
              title="Видалити"
              variant="outline-danger"
              onClick={() => setShowModal(true)}>
              <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"
                className="delete-icon">
                <use href="#icon-danger"/>
              </svg>
            </Button>
          </div>
        }
      </div>

      {
        showDelete &&
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalText}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Закрити
              </Button>
              <Button variant="danger" onClick={deleteHandler}>
                Видалити
              </Button>
            </Modal.Footer>
          </Modal>
      }
    </>
  );
};

export default EditBar;
