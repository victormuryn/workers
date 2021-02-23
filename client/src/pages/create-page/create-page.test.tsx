import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';

import renderer from 'react-test-renderer';

import createMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';

import CreatePage from './create-page';

const mockStore = createMockStore();

jest.mock('@ckeditor/ckeditor5-build-classic');
jest.mock('@ckeditor/ckeditor5-react');

describe(`CreatePage tests`, () => {
  it(`CreatePage with freelancer renders corrects`, () => {
    const store = mockStore({
      user: {
        accountType: `freelancer`,
      },
    });

    const tree = renderer.create(
      <Provider store={store}>
        <Router>
          <CreatePage />
        </Router>
      </Provider>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it(`CreatePage with client renders corrects`, () => {
    const store = mockStore({
      user: {
        accountType: `client`,
      },
    });

    const tree = renderer.create(
      <Provider store={store}>
        <Router>
          <CreatePage />
        </Router>
      </Provider>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
