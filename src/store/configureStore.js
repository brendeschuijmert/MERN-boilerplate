import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { routerMiddleware } from "react-router-redux";
import { createBrowserHistory } from "history";
import rootReducer from "store/reducers";
import sagas from "store/sagas";

export const history = createBrowserHistory();

export default function configureStore(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware();
  let middlewares = applyMiddleware(sagaMiddleware, routerMiddleware(history));

  if (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__) {
    middlewares = compose(
      middlewares,
      window.__REDUX_DEVTOOLS_EXTENSION__() // eslint-disable-line
    );
  }
  const store = createStore(rootReducer, initialState, compose(middlewares));
  sagaMiddleware.run(sagas);
  return store;
}
