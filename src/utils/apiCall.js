import { call, put } from "redux-saga/effects";
import { get } from "lodash-es";
import axios from "axios";
import { Fail, Pending, Success } from "./status";

export default ({ type, method, path, headers, success }) =>
  function*(action) {
    const { body, params, success: successPayload, fail: failPayload } =
      action.payload || {};

    const authToken = localStorage.getItem("auth_token");
    let header = {
      "Content-Type": "application/json"
    };

    if (authToken) {
      const token = JSON.parse(authToken).token;
      header["Authorization"] = `Bearer ${token}`;
    }

    try {
      yield put({
        type: Pending(type)
      });
      const options = {
        url: `http://localhost:4000/api${
          typeof path === "function" ? path(action.payload) : path
        }`,
        method: method,
        headers: header,
        data: body,
        params
      };
      const res = yield call(axios.request, options);

      yield put({
        type: Success(type),
        payload: res.data
      });

      successPayload && successPayload(res);
      success && success(res, action);
    } catch (err) {
      const errRes = get(err, "response", err);

      yield put({
        type: Fail(type),
        payload: errRes
      });
      failPayload && failPayload(err);
    }
  };
