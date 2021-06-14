import {reducer} from './reducer';
import {USER_LOGIN, USER_LOGOUT} from './user/types';
import {ActionCreator} from './action-creator';

describe(`ActionCreator tests`, () => {
  it(`ActionCreator.username works good`, () => {
    const login = ActionCreator.login({
      token: `test-token`,
      userId: `test-user-id`,
      accountType: `freelancer`,
      username: `test-username`,
      name: `text-name`,
      surname: `test-surname`,
      image: {
        extension: ``,
        buffer: ``,
      },
    });

    expect(login).toEqual({
      type: USER_LOGIN,
      payload: {
        token: `test-token`,
        userId: `test-user-id`,
        accountType: `freelancer`,
        username: `test-username`,
        name: `text-name`,
        surname: `test-surname`,
        image: {
          extension: ``,
          buffer: ``,
        },
      },
    });
  });

  it(`ActionCreator.logout works good`, () => {
    // const logout = ActionCreator.logout(`123`, `123`);
    const logout = ActionCreator.logout();

    expect(logout).toEqual({
      type: USER_LOGOUT,
    });
  });
});

describe(`Reducer tests`, () => {
  it(`USER_username test`, () => {
    const action = {
      type: USER_LOGIN,
      payload: {
        token: `test-token`,
        username: `test-username`,
        userId: `test-user-id`,
        accountType: `freelancer`,
      },
    };

    // @ts-ignore
    const data = reducer(undefined, action);

    expect(data).toEqual({
      user: {
        isAuthenticated: true,
        token: `test-token`,
        username: `test-username`,
        userId: `test-user-id`,
        accountType: `freelancer`,
      },
    });
  });

  it(`USER_LOGOUT test`, () => {
    const action = {
      type: USER_LOGOUT,
    };

    // @ts-ignore
    const data = reducer(undefined, action);

    expect(data).toEqual({
      user: {
        isAuthenticated: false,
        token: null,
        username: null,
        userId: null,
        accountType: null,
      },
    });
  });
});
