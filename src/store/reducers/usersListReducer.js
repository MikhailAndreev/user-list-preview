import { handleActions } from "redux-actions";

import * as actions from "../actions/userList";

export const usersListReducer = handleActions(
  {
    [actions.fetchUsersRequest](state) {
      return {
        ...state,
        isLoading: true,
        error: false,
      };
    },
    [actions.fetchUsersSuccess](state, { payload }) {
      return {
        ...state,
        userListData: payload,
        isLoading: true,
        error: false,
      };
    },
    [actions.fetchUsersFailure](state) {
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    },
  },
  {
    userListData: null,
    isLoading: false,
    error: false,
  }
);
