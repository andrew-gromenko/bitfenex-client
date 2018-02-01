import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga'
import reducers from './reducers';
import sagas from './sagas';


const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers(reducers),
  applyMiddleware(sagaMiddleware, thunk)
);

sagaMiddleware.run(sagas);

export default store;
export const middlewares = [
  sagaMiddleware,
  thunk,
];
