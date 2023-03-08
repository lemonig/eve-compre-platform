import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/es/storage";
import { configureStore } from "@reduxjs/toolkit";

import loadSlice from "./features/loadSlice";
import userSlice from "./features/userSlice";
import menuSlice from "./features/menuSlice";
import menulistSlice from "./features/menulistSlice";
import tokenSlice from "./features/tokenSlice";
import platformSlice from "./features/platformSlice";

const persistConfig = {
  key: "root",
  storage,
  blacklist: [""],
};

const reducer = {
  load: loadSlice,
  token: tokenSlice,
  menu: menulistSlice,
  user: userSlice,
  menuKey: menuSlice,
  platform: platformSlice,
};
const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: reducer,
});
