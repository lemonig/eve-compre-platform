import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { menuList } from "@Api/user.js";
import { handleMenu } from "@Utils/menu";
// 菜单列表
const initialState = localStorage.getItem("menuList")
  ? JSON.parse(localStorage.getItem("menuList"))
  : [];

const getRouteMenu = async () => {
  let { message: msg, success, data } = await menuList();
  data.map((item) => {
    if (item.label === "监控看板") item.index = true;
    if (!item.visible) {
      delete item.pid;
    }
  });
  localStorage.setItem("menuList", JSON.stringify(data));
  let menuTree = handleMenu(data);

  localStorage.setItem("menuTree", JSON.stringify(menuTree));
  return data;
};

export const getMenuData = createAsyncThunk("user/getMenu", getRouteMenu);

export const menulistSlice = createSlice({
  name: "menulist",
  initialState: initialState,
  reducers: {
    // 数据请求完触发
    loadMenuData: (state, { payload }) => {
      state = payload;
    },
  },
  // extraReducers(builder) {
  //   builder
  //     .addCase(getMenuData.pending, (state) => {
  //       console.log("🚀 ~ 进行中！");
  //     })
  //     .addCase(getMenuData.fulfilled, (state, { payload }) => {
  //       console.log("🚀 ~ fulfilled", payload);
  //       state = payload.data;
  //     })
  //     .addCase(getMenuData.rejected, (state, err) => {
  //       console.log("🚀 ~ rejected", err);
  //     });
  // },
});

const { actions, reducer } = menulistSlice;
export const { loadMenuData } = actions;
export default reducer;
