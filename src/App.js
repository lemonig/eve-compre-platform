import logo from "./logo.svg";
import "./styles/index.less";
import { BrowserRouter } from "react-router-dom";
import Router from "./router/index";
import React, { useEffect } from "react";
import Loading from "./apps/components/Loading";
import "./App.less";
import { settingGet, settingUpdate } from "@Api/set_base.js";
import { SET_PLATFORM } from "@Store/features/platformSlice";
import { useDispatch, useSelector } from "react-redux";
import { getMenuData } from "@Store/features/menulistSlice";

function App() {
  let dispatch = useDispatch();
  useEffect(() => {
    console.log("App loading...");
    if (localStorage.getItem("token")) {
      getSetData();
      getMenuList();
    }
  }, []);

  const getSetData = async () => {
    let { data } = await settingGet();
    dispatch(SET_PLATFORM(data));
  };
  const getMenuList = async () => {
    await dispatch(getMenuData());
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Router />
      </BrowserRouter>

      <Loading id="app-load"></Loading>
    </div>
  );
}

export default App;
