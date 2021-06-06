import {combineReducers} from 'redux';

import userReducer, {State as UserState} from './user/reducer';
import projectReducer, {State as ProjectState} from './project/reducer';
import messagesReducer, {State as MessagesState} from './messages/reducer';

export type State = {
  user: UserState,
  project: ProjectState,
  messages: MessagesState,
}

export const reducer = combineReducers({
  user: userReducer,
  project: projectReducer,
  messages: messagesReducer,
});
