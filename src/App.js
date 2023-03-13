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

function App() {
  let dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem("token")) getPageData();
  }, []);

  const getPageData = async () => {
    let { data } = await settingGet();
    dispatch(SET_PLATFORM(data));
    // setData(data);
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
