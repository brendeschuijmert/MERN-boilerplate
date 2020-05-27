import { createAction } from "redux-actions";
import { HIDE_TOAST, SHOW_TOAST } from "store/constants";

// Toast
export const hideToast = createAction(HIDE_TOAST);
export const showToast = createAction(SHOW_TOAST);

export default {
  hideToast,
  showToast
};
