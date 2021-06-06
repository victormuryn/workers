import {Project} from '../../types/types';

export const PROJECT_SET = `PROJECT/SET`;
export const PROJECT_ERROR = `PROJECT/ERROR`;
export const PROJECT_LOADING = `PROJECT/LOADING`;
export const PROJECT_REMOVE_BET = `PROJECT/REMOVE_BET`;
export const PROJECT_DELETE = `PROJECT/DELETE`;

interface ProjectSetDataAction {
  type: typeof PROJECT_SET,
  payload: Project,
}

interface ProjectSetError {
  type: typeof PROJECT_ERROR,
  payload: string | null,
}

interface ProjectSetLoading {
  type: typeof PROJECT_LOADING,
  payload: boolean,
}

interface ProjectRemoveBet {
  type: typeof PROJECT_REMOVE_BET,
  payload: string,
}

interface ProjectDelete {
  type: typeof PROJECT_DELETE,
  payload: {
    id: string,
    expire: string,
  }
}

export type ProjectActionTypes =
  ProjectSetDataAction |
  ProjectSetError |
  ProjectSetLoading |
  ProjectRemoveBet |
  ProjectDelete;
