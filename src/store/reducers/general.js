import { handleActions } from "redux-actions";
import { SET_MEDIA_FLAG } from "store/constants";

const initialState = {
  media: "desktop"
};

export default handleActions(
  {
    [SET_MEDIA_FLAG]: (state, { payload }) => ({
      ...state,
      ...payload
    })
  },
  initialState
);
