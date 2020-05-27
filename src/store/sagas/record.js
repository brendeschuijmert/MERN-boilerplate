import { takeLatest } from "redux-saga/effects";
import {
  GET_RECORDS,
  CREATE_RECORD,
  UPDATE_RECORD,
  DEL_RECORD,
  EXPORT_RECORDS
} from "store/constants";
import apiCall from "utils/apiCall";

const getRecords = apiCall({
  type: GET_RECORDS,
  method: "get",
  path: "/records/"
});

const generateRecords = apiCall({
  type: EXPORT_RECORDS,
  method: "get",
  path: "/records/export"
});

const postRecord = apiCall({
  type: CREATE_RECORD,
  method: "post",
  path: "/records/"
});

const putRecord = apiCall({
  type: UPDATE_RECORD,
  method: "put",
  path: ({ id }) => `/records/${id}/`
});

const deleteRecord = apiCall({
  type: DEL_RECORD,
  method: "delete",
  path: ({ id }) => `/records/${id}/`
});

export default function* rootSaga() {
  yield takeLatest(GET_RECORDS, getRecords);
  yield takeLatest(CREATE_RECORD, postRecord);
  yield takeLatest(DEL_RECORD, deleteRecord);
  yield takeLatest(UPDATE_RECORD, putRecord);
  yield takeLatest(EXPORT_RECORDS, generateRecords);
}
