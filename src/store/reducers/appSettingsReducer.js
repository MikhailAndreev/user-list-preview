import { handleActions } from "redux-actions";

import * as actions from "../actions/index";

export const appSettingsReducer = handleActions(
  {
    [actions.showAppPreloader](state, { payload }) {
      return {
        ...state,
        showPreloader: payload,
      };
    },
  },
  {
    showPreloader: false,
    error: false,
  }
);
