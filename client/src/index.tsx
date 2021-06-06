import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';
import {Provider} from 'react-redux';
import {reducer} from './redux/reducer';
import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
}

const composeEnhancers =
  (window as Window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const initProject = () => {
  const store = createStore(
    reducer,
    composeEnhancers(
      applyMiddleware(thunk),
    ),
  );

  ReactDOM.render(
    // <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector('#root'),
  );
};

initProject();
