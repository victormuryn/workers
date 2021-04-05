import {Bet, MinUser, Project} from '../../types/types';
import {
  PROJECT_ERROR,
  PROJECT_LOADING,
  PROJECT_REMOVE_BET,
  PROJECT_SET,
  ProjectActionTypes,
} from '../types';

export type State = {
  project: Project,
  author: MinUser,
  bets: Array<Bet>,
  error: string | null,
  loading: boolean,
  category: {
    title: string,
    url: string,
  }
};

const time = new Date().toLocaleString();

const initialState: State = {
  project: {
    _id: ``,
    hot: false,
    date: time,
    title: ``,
    price: 0,
    views: 0,
    expire: time,
    remote: true,
    description: ``,
    location: {
      city: ``,
      region: ``,
      latitude: 0,
      longitude: 0,
    },
  },
  author: {
    _id: ``,
    name: ``,
    image: false,
    surname: ``,
    username: ``,
    location: {
      city: ``,
      country: ``,
    },
  },
  bets: [],
  error: null,
  loading: false,
  category: {
    title: ``,
    url: ``,
  }
};

export default (
  state = initialState,
  action: ProjectActionTypes,
): State => {
  switch (action.type) {
  case PROJECT_SET:
    return {
      ...state,
      ...action.payload,
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
    const bets = [...state.bets];
    const deleteIndex = bets.findIndex(({_id}) => action.payload === _id);
    bets.splice(deleteIndex, 1);

    return {
      ...state,
      bets,
    };
  }

  return state;
};
