import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';

import renderer, {create, act} from 'react-test-renderer';

import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';

import App from './app';

const mockStore = configureMockStore();

describe(`App tests`, () => {
  it(`App not authenticated renders corrects`, () => {
    const store = mockStore({
      user: {
        isAuthenticated: false,
        accountType: null,
      },
    });

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = create(
        <Provider store={store}>
          <Router>
            <App />
          </Router>
        </Provider>,
      );
    });

    // @ts-ignore
    const json = tree.toJSON();
    expect(json).toMatchSnapshot();
  });

  it(`App authenticated renders corrects`, () => {
    const store = mockStore({
      user: {
        isAuthenticated: true,
        accountType: `client`,
        username: `hellcaster`,
      },
    });

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = create(
        <Provider store={store}>
          <Router>
            <App />
          </Router>
        </Provider>,
      );
    });

    // @ts-ignore
    const json = tree.toJSON();
    expect(json).toMatchSnapshot();
  });
});
