import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { settingGet, settingUpdate } from "@Api/set_base.js";

const initialState = {
  platform: "",
};

const getPlatform = async () => {
  let { message: msg, success, data } = await settingGet();
  // localStorage.setItem("platform", JSON.stringify(data));
  return data;
};

export const getPlatformData = createAsyncThunk(
  "user/getPlatform",
  getPlatform
);

export const platformSlice = createSlice({
  name: "platform",
  initialState: initialState.platform,
  reducers: {
    SET_PLATFORM: (state, { payload }) => {
      // localStorage.setItem("platform", JSON.stringify(payload));
      return (state = payload);
    },
  },
});

const { actions, reducer } = platformSlice;

export const { SET_PLATFORM } = actions;
export default reducer;
