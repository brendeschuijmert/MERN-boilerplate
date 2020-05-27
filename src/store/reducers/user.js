import { handleActions } from "redux-actions";
import { map, set } from "lodash-es";
import { Success, Fail } from "utils/status";
import {
  GET_USERS,
  CREATE_USER,
  UPDATE_USER,
  DEL_USER,
  GET_USER,
  SET_USER_PARAMS
} from "store/constants";

const initialState = {
  users: [],
  user: null,
  count: 0,
  loading: true,
  params: {
    page: 1,
    limit: 5
  },
  error: ""
};

export default handleActions(
  {
    [SET_USER_PARAMS]: (state, { payload }) => ({
      ...state,
      loading: true,
      params: {
        ...state.params,
        ...payload
      }
    }),
    [Success(GET_USERS)]: (state, { payload }) => ({
      ...state,
      loading: false,
      users: payload.users,
      count: payload.count,
      error: null
    }),
    [Fail(GET_USERS)]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload.data
    }),
    [Success(CREATE_USER)]: (state, { payload }) => ({
      ...state,
      loading: false,
      user: payload,
      count: state.count + 1,
      error: null
    }),
    [Fail(CREATE_USER)]: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        error: payload.data,
        user: null
      };
    },
    [Success(UPDATE_USER)]: (state, { payload }) => {
      const updatedIdx = map(state.users, "_id").indexOf(payload["_id"]);
      const newState = Object.assign({}, state);
      set(newState, `users.${updatedIdx}`, payload);

      return {
        ...newState,
        loading: false,
        user: payload,
        error: null
      };
    },
    [Fail(UPDATE_USER)]: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        error: payload.data
      };
    },
    [Success(GET_USER)]: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        user: payload,
        error: null
      };
    },
    [Fail(GET_USER)]: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        error: payload.data
      };
    },
    [Success(DEL_USER)]: state => {
      return {
        ...state,
        loading: false,
        count: state.count - 1,
        error: null
      };
    },
    [Fail(DEL_USER)]: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        error: payload.data
      };
    }
  },
  initialState
);
