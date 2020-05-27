import { all } from "redux-saga/effects";
import auth from "./auth";
import record from "./record";
import user from "./user";

export default function* rootSaga() {
  yield all([auth(), record(), user()]);
}
