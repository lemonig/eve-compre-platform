import { createSlice } from "@reduxjs/toolkit";
const initialState = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : {};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    SET_USER: (state, { payload }) => {
      state = payload;
    },
  },
});

const { actions, reducer } = userSlice;
export const { SET_USER } = actions;

export default reducer;
