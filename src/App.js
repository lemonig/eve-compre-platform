import logo from "./logo.svg";
import "./styles/index.less";
import { BrowserRouter } from "react-router-dom";
import Router from "./router/index";
import React, { useEffect } from "react";
import Processing from "./apps/components/Processing";
import "./App.less";
import { settingGet, settingUpdate } from "@Api/set_base.js";
import { SET_PLATFORM } from "@Store/features/platformSlice";
import { useDispatch, useSelector } from "react-redux";
import { getMenuData } from "@Store/features/menulistSlice";
import { getPlatformData } from "@Store/features/platformSlice";

function App() {
  let dispatch = useDispatch();
  useEffect(() => {
    console.log("App loading...");
    if (localStorage.getItem("token")) {
      dispatch(getPlatformData())
      dispatch(getMenuData())
    }
  }, []);



  return (
    <div className="App">
      <BrowserRouter>
        <Router />
      </BrowserRouter>

      <Processing id="app-load"></Processing>
    </div>
  );
}

export default App;
