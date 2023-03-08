import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  token: localStorage.getItem("token") ?? "",
};

export const tokenSlice = createSlice({
  name: "token",
  initialState: initialState.token,
  reducers: {
    SET_TOKEN: (state, { payload }) => {
      return (state = {
        ...state,
        token: payload,
      });
    },
  },
});

const { actions, reducer } = tokenSlice;

export const { SET_TOKEN } = tokenSlice.actions;
export default reducer;
