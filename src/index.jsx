import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import "antd/dist/antd.css";

import App from "./containers/App";
import { loadState, saveState } from "./utils/localeStorage";
import { mainReducers } from "./store/reducers/index";
import store from "./store/store";

console.log(mainReducers);

const logger = (store) => {
  return (next) => {
    return (action) => {
      console.log("Middleware dispatch action", action);
      const result = next(action);
      console.log("Middleware next state", result);
      return result;
    };
  };
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE || compose;

const persistedState = loadState();
// const store = createStore(
//   mainReducers,
//   persistedState,
//   composeEnhancers(applyMiddleware(logger, thunk))
// );

// store.subscribe(() => {
//   saveState({
//     get: store.getState().getReducer,
//   });
// });

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(app, document.getElementById("app"));
