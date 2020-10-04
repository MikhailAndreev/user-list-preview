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
      const favList = JSON.parse(localStorage.getItem("favoriteUsers"));
      let updFavList = [];
      if (favList) {
        updFavList = [...favList];
      }
      return {
        ...state,
        userListData: payload,
        favoriteList: [...updFavList],
        isLoading: false,
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
    [actions.addUserToFavorite](state, { payload }) {
      const { userListData, favoriteList } = state;
      let oldFavList = favoriteList;
      const lsValue = JSON.parse(localStorage.getItem("favoriteUsers"));
      if (lsValue) {
        oldFavList = lsValue.filter((user) => user.id !== payload);
      }
      const favoriteUser = userListData.find((user) => user.id === payload);
      const updFavList = oldFavList.concat(favoriteUser);
      localStorage.setItem("favoriteUsers", JSON.stringify(updFavList));
      console.log('payload', payload);

      return {
        ...state,
        favoriteList: [...updFavList],
      };
    },
    [actions.deleteUserFromFavorite](state, { payload }) {
      const { userListData, favoriteList } = state;
      // const lsValue = JSON.parse(localStorage.getItem("favoriteUsers"));
      let oldFavList = favoriteList;
      // if (lsValue) {
      //   oldFavList = lsValue.filter((user) => user.id === payload);
      // }
      const updFavList = oldFavList.filter((user) => user.id !== payload);
      console.log('from REDUCER DELETE', updFavList);
      localStorage.setItem("favoriteUsers", JSON.stringify(updFavList));
      return {
        ...state,
        favoriteList: [...updFavList],
      };
    },
  },
  {
    favoriteList: [],
    userListData: null,
    isLoading: false,
    error: false,
  }
);
