import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { settingGet, settingUpdate } from "@Api/set_base.js";

const initialState = {
  platform: {},
};

const getPlatform = async () => {
  let { message: msg, success, data } = await settingGet();
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
    loadSettingData: (state, { payload }) => {
      return (state = payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getPlatformData.pending, (state) => {
        // console.log('setting pending');
      })
      .addCase(getPlatformData.fulfilled, (state, { payload }) => {
        return (state = payload);
      })
      .addCase(getPlatformData.rejected, (state, err) => {
        // console.log('setting err');
      });
  },
});

const { actions, reducer } = platformSlice;

export const { loadSettingData } = actions;
export default reducer;
