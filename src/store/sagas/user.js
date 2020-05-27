import { takeLatest } from "redux-saga/effects";
import {
  GET_USERS,
  CREATE_USER,
  UPDATE_USER,
  DEL_USER,
  GET_USER
} from "store/constants";
import apiCall from "utils/apiCall";

const getUser = apiCall({
  type: GET_USER,
  method: "get",
  path: ({ id }) => `/users/${id}/`
});

const getUsers = apiCall({
  type: GET_USERS,
  method: "get",
  path: "/users/"
});

const createUser = apiCall({
  type: CREATE_USER,
  method: "post",
  path: "/users/"
});

const updateUser = apiCall({
  type: UPDATE_USER,
  method: "put",
  path: ({ id }) => `/users/${id}/`
});

const deleteUser = apiCall({
  type: DEL_USER,
  method: "delete",
  path: ({ id }) => `/users/${id}/`
});

export default function* rootSaga() {
  yield takeLatest(GET_USERS, getUsers);
  yield takeLatest(CREATE_USER, createUser);
  yield takeLatest(DEL_USER, deleteUser);
  yield takeLatest(UPDATE_USER, updateUser);
  yield takeLatest(GET_USER, getUser);
}
