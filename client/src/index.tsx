import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';
import {reducer} from './redux/reducer';
import {createStore, compose} from 'redux';
import {Provider} from 'react-redux';

interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
}

const composeEnhancers =
  (window as Window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const initProject = () => {
  const store = createStore(
    reducer,
    composeEnhancers(),
  );

  ReactDOM.render(
    <Provider store={store}><App/></Provider>,
    document.querySelector('#root'),
  );
};

initProject();
