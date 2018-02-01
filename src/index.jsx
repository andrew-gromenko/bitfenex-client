import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import App from './components/App';
import store from './store';

store.dispatch({type: 'START'});

function render(Component) {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <Component />
      </AppContainer>
    </Provider>,
    document.getElementById('app'));
}

if (module.hot) {
  module.hot.accept('./components/App', () => render(App));
}

render(App);
