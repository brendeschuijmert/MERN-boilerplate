import { createAction } from "redux-actions";
import {
  GET_RECORDS,
  CREATE_RECORD,
  UPDATE_RECORD,
  DEL_RECORD,
  EXPORT_RECORDS,
  SET_PARAMS
} from "store/constants";

// Records
export const getRecords = createAction(GET_RECORDS);
export const createRecord = createAction(CREATE_RECORD);
export const updateRecord = createAction(UPDATE_RECORD);
export const delRecord = createAction(DEL_RECORD);
export const generateRecords = createAction(EXPORT_RECORDS);
export const setParams = createAction(SET_PARAMS);

export default {
  getRecords,
  createRecord,
  updateRecord,
  delRecord,
  generateRecords,
  setParams
};
