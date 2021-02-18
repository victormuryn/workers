import {reducer} from './reducer';
import {USER_LOGIN, USER_LOGOUT} from './types';
import {ActionCreator} from './action-creator';

describe(`ActionCreator tests`, () => {
  it(`ActionCreator.login works good`, () => {
    const login = ActionCreator.login(
      `test-token`,
      `test-user-id`,
      `test-account-type`,
      `test-login`,
    );

    expect(login).toEqual({
      type: USER_LOGIN,
      payload: {
        token: `test-token`,
        userId: `test-user-id`,
        accountType: `test-account-type`,
        login: `test-login`,
      },
    });
  });

  it(`ActionCreator.logout works good`, () => {
    const login = ActionCreator.logout();

    expect(login).toEqual({
      type: USER_LOGOUT,
      payload: {},
    });
  });
});

describe(`Reducer tests`, () => {
  it(`USER_LOGIN test`, () => {
    const action = {
      type: USER_LOGIN,
      payload: {
        token: `test-token`,
        login: `test-login`,
        userId: `test-user-id`,
        accountType: `test-account-type`,
      },
    };

    const data = reducer(undefined, action);

    expect(data).toEqual({
      user: {
        isAuthenticated: true,
        token: `test-token`,
        login: `test-login`,
        userId: `test-user-id`,
        accountType: `test-account-type`,
      },
    });
  });

  it(`USER_LOGIN test`, () => {
    const action = {
      type: USER_LOGOUT,
      payload: {},
    };

    const data = reducer(undefined, action);

    expect(data).toEqual({
      user: {
        isAuthenticated: false,
        token: null,
        login: null,
        userId: null,
        accountType: null,
      },
    });
  });
});
