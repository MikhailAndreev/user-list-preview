import { createAction } from "redux-actions";
import axios from "axios";

import { API_ORIGIN } from "../../constants/Const";
import Helper from "../../utils/reducerHelper";
import {showAppPreloader} from './index'

export const fetchUsersSuccess = createAction("FETCH_USERS_SUCCESS");
export const fetchUsersRequest = createAction("FETCH_USERS_REQUEST");
export const fetchUsersFailure = createAction("FETCH_USERS_FAILURE");
export const fetchUsers = () => {
  return (dispatch) => {
    dispatch(fetchUsersRequest());
    dispatch(showAppPreloader(true));
    axios
      .get(API_ORIGIN + "data.json", Helper.getXHRHeaders())
      .then((res) => {
        // console.log("res from action", res);
        dispatch(fetchUsersSuccess(res.data));
        dispatch(showAppPreloader(false));
      })
      .catch((err) => {
        console.log("err", err);
        dispatch(fetchUsersFailure());
        dispatch(showAppPreloader(false));
      });
  };
};


export const addUserToFavorite = createAction("ADD_USER_TO_FAVORITE");
export const deleteUserFromFavorite = createAction("DELETE_USER_FROM_FAVORITE");
