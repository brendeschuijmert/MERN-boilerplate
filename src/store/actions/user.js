import { createAction } from "redux-actions";
import {
  GET_USERS,
  CREATE_USER,
  UPDATE_USER,
  DEL_USER,
  GET_USER,
  SET_USER_PARAMS
} from "store/constants";

export const getUsers = createAction(GET_USERS);
export const createUser = createAction(CREATE_USER);
export const updateUser = createAction(UPDATE_USER);
export const deleteUser = createAction(DEL_USER);
export const getUser = createAction(GET_USER);
export const setParams = createAction(SET_USER_PARAMS);

export default {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  setParams
};
