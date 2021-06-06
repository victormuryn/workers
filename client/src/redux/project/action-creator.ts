import api from '../../utils/api';

import {Action, Dispatch} from 'redux';
import {Project, UserBet} from '../../types/types';

import {
  PROJECT_DELETE,
  PROJECT_ERROR, PROJECT_LOADING,
  PROJECT_REMOVE_BET, PROJECT_SET,
  ProjectActionTypes,
} from './types';

const ActionCreator = {
  getProject: (id: string, token: string | null) => {
    return async (dispatch: Dispatch<Action>) => {
      dispatch(ActionCreator.setLoading(true));
      dispatch(ActionCreator.setProjectError(null));

      return api
        .get<Project>(`/project/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then(({data}) => {
          return dispatch(ActionCreator.setProject(data));
        })
        .catch(({response}) => {
          const errorMessage = response.data.message ||
            `Щось пішло не так, спробуйте знову.`;

          return dispatch(ActionCreator.setProjectError(errorMessage));
        })
        .then(() => {
          return dispatch(ActionCreator.setLoading(false));
        });
    };
  },

  setProjectError: (error: string | null): ProjectActionTypes => ({
    type: PROJECT_ERROR,
    payload: error,
  }),

  setProject: (project: Project): ProjectActionTypes => ({
    type: PROJECT_SET,
    payload: project,
  }),

  setLoading: (loading: boolean): ProjectActionTypes => ({
    type: PROJECT_LOADING,
    payload: loading,
  }),

  postBet: (bet: UserBet) => async () => {
    return api.post(`/bet/`, {
      ...bet,
      date: new Date(),
    }, {
      headers: {
        'Authorization': `Bearer ${bet.token}`,
      },
    });
  },

  deleteBet: (id: string, token: string) => {
    return async (dispatch: Dispatch<Action>) => {
      return api
        .delete(`/bet/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then(() => {
          dispatch(ActionCreator.removeBet(id));
        });
    };
  },

  deleteProject: (id: string, token: string) => {
    return async (dispatch: Dispatch<Action>) => {
      return api
        .delete<Project>(`/project/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then(({data}) => {
          dispatch(ActionCreator.removeProject(id, data.expire));
          console.log(`success`);
        });
    };
  },

  removeProject: (id: string, expire: string) => ({
    type: PROJECT_DELETE,
    payload: {id, expire},
  }),

  removeBet: (id: string): ProjectActionTypes => ({
    type: PROJECT_REMOVE_BET,
    payload: id,
  }),
};

export default ActionCreator;
