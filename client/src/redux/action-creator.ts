import UserActionCreator from './user/action-creator';
import ProjectActionCreator from './project/action-creator';
import MessagesActionCreator from './messages/action-creator';

export const ActionCreator = {
  ...UserActionCreator,
  ...MessagesActionCreator,
  ...ProjectActionCreator,
};

