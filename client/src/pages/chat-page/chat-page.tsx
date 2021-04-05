import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import './chat-page.scss';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Media from 'react-bootstrap/Media';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';

import {State} from '../../redux/reducer';

import {ActionCreator} from '../../redux/action-creator';
import {MessageUser} from '../../redux/types';
import Badge from 'react-bootstrap/Badge';
import {getPluralNoun, setPageMeta} from '../../utils/utils';


const ChatPage: React.FC = () => {
  const {
    users,
    unread,
    selectedUser,
  } = useSelector((state: State) => state.messages);

  const title = unread.length ?
    `${unread.length} ${getPluralNoun(unread.length,
      `нове повідомлення`,
      `нових повідомлень`)
    }` :
    `Повідомлення`;

  setPageMeta(title);

  const dispatch = useDispatch();

  const [text, setText] = useState<string>(``);

  useEffect(() => {
    return () => {
      dispatch(ActionCreator.selectUser());
    };
  }, []);

  const onMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(ActionCreator.onMessageSubmit(text));
    setText(``);
  };

  const setSelectedUser = (user: MessageUser) => {
    if (selectedUser?.userID !== user.userID) {
      setText(``);
      dispatch(ActionCreator.selectUser(user));
    }
  };

  return (
    <Container>
      <Row className="my-5 rounded-lg overflow-hidden shadow">

        {/* Users box*/}
        <Col xs={5} className="px-0">
          <div className="bg-white">
            <div className="bg-gray px-4 py-2 bg-light">
              <h5 className="mb-0 py-1">Недавні повідомлення</h5>
            </div>

            <div className="messages-box">
              <ListGroup className="rounded-0">
                {
                  users.map((user) => {
                    const {username, userID, hasNewMessages} = user;
                    const isSelected = selectedUser?.userID === userID;

                    return (
                      <ListGroup.Item
                        action
                        key={userID}
                        active={isSelected}
                        className="rounded-0"
                        onClick={() => setSelectedUser(user)}
                        variant={!isSelected ? `light` : undefined}
                      >
                        <Media>
                          <img
                            src={`http://localhost:8080/img/users/${username}.webp`}
                            alt={username} className="rounded-circle" width={50}
                          />
                          <Media.Body className="media-body ms-4">
                            <div
                              className="d-flex align-items-center
                         justify-content-between mb-1">
                              <h6 className="mb-0">
                                {username}{` `}
                                {hasNewMessages && (
                                  <Badge
                                    variant="danger"
                                    className="bg-danger"
                                  >!</Badge>
                                )}
                              </h6>
                              <small className="small font-weight-bold">
                                9 Nov
                              </small>
                            </div>

                            <p className="mb-0 text-small">
                              consectetur adipisicing elit, sed do eiusmod
                              tempor incididunt ut labore.
                            </p>
                          </Media.Body>
                        </Media>
                      </ListGroup.Item>
                    );
                  })
                }
              </ListGroup>
            </div>
          </div>
        </Col>

        {/* Chat Box*/}
        <div className="col-7 px-0">
          <aside className="px-4 py-5 chat-box bg-white">
            {
              selectedUser ?
                selectedUser.messages.map((message, i) => {
                  const {content, fromSelf} = message;

                  return (
                    <Media
                      key={`${content}${i}`}
                      className={`w-50 mb-3 ${fromSelf && `ms-auto`}`}
                    >
                      <Media.Body>
                        <div
                          className={`rounded py-2 px-3 mb-2
                          bg-${fromSelf ? `primary` : `light`}`}>
                          <p className={`text-small mb-0
                        text-${fromSelf ? `light` : `muted`}`}>
                            {content}
                          </p>
                        </div>
                        <p className="small text-muted">12:00 PM | Aug 13</p>
                      </Media.Body>
                    </Media>
                  );
                }) : <div>
                  <p className="text-center">Виберіть користувача</p>
                </div>
            }

          </aside>

          {/* Typing area */}
          <Form className="bg-light">
            <div className="input-group align-items-center">
              <Form.Control
                rows={3}
                value={text}
                as="textarea"
                disabled={selectedUser === null}
                placeholder="Введіть повідомлення"
                className="form-control rounded-0 border-0 py-4 bg-light"
                onChange={(event) => setText(event.target.value)}
              />

              <div className="input-group-append">
                <button
                  type="submit"
                  id="button-addon2"
                  className="btn btn-link"
                  onClick={onMessageSubmit}
                  disabled={selectedUser === null}
                >
                  <img src="/img/paper-plane.svg" alt="Надіслати" width={20} />
                </button>
              </div>

            </div>
          </Form>

        </div>
      </Row>
    </Container>
  );
};

export default ChatPage;
