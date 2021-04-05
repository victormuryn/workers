import {combineReducers} from 'redux';

import userReducer, {State as UserState} from './reducers/user';
import projectReducer, {State as ProjectState} from './reducers/project';
import messagesReducer, {State as MessagesState} from './reducers/messages';


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
