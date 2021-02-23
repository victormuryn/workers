import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import renderer from 'react-test-renderer';

import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';

import Header from './header';

const mockStore = configureMockStore();

describe(`Header tests`, () => {
  it(`Header freelancer renders corrects`, () => {
    const store = mockStore({
      user: {
        username: `hellcaster`,
        accountType: `freelancer`,
      },
    });

    const tree = renderer.create(
      <Provider store={store}>
        <Router>
          <Header/>
        </Router>
      </Provider>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it(`Header client renders corrects`, () => {
    const store = mockStore({
      user: {
        username: `yellowkiiid`,
        accountType: `client`,
      },
    });

    const tree = renderer.create(
      <Provider store={store}>
        <Router>
          <Header/>
        </Router>
      </Provider>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
