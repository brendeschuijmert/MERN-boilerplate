import { createAction } from "redux-actions";
import { SET_MEDIA_FLAG } from "store/constants";

export const setMediaFlag = createAction(SET_MEDIA_FLAG);

export default {
  setMediaFlag
};
