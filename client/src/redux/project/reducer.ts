import {Project} from '../../types/types';
import {
  PROJECT_DELETE,
  PROJECT_ERROR,
  PROJECT_LOADING,
  PROJECT_REMOVE_BET,
  PROJECT_SET,
  ProjectActionTypes,
} from './types';

export interface State {
  project: Project,
  loading: boolean,
  error: string | null,
}

const time = new Date().toLocaleString();

const initialState: State = {
  project: {
    _id: ``,
    bets: [],
    price: 0,
    views: 0,
    title: ``,
    date: time,
    hot: false,
    expire: time,
    remote: true,
    description: ``,
    category: [{
      _id: `none`,
      title: `Не вказано`,
      url: ``,
    }],
    location: {
      _id: ``,
      city: ``,
      region: ``,
      latitude: 0,
      country: ``,
      longitude: 0,
    },
    author: {
      _id: ``,
      name: ``,
      image: false,
      surname: ``,
      username: ``,
    },
    updated: {
      count: 0,
      lastDate: time,
    },
  },
  error: null,
  loading: false,
};

export default (
  state = initialState,
  action: ProjectActionTypes,
): State => {
  switch (action.type) {
  case PROJECT_SET:
    return {
      ...state,
      project: {...action.payload},
    };

  case PROJECT_ERROR:
    return {
      ...state,
      error: action.payload,
    };

  case PROJECT_LOADING:
    return {
      ...state,
      loading: action.payload,
    };

  case PROJECT_REMOVE_BET:
    const bets = [...state.project.bets];
    const deleteIndex = bets.findIndex(({_id}) => action.payload === _id);
    bets.splice(deleteIndex, 1);

    return {
      ...state,
      project: {
        ...state.project,
        bets,
      },
    };

  case PROJECT_DELETE:
    if (state.project._id === action.payload.id) {
      return {
        ...state,
        project: {
          ...state.project,
          expire: action.payload.expire,
        },
      };
    }

    return state;
  }

  return state;
};
