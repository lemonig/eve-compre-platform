import React from "react";
import ReactDOM from "react-dom/client";

import "./blank.css";
import "./index.css";
import "./styles/theme.less";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";

import zhCN from "antd/locale/zh_CN";
import { Provider } from "react-redux";
import { store } from "./store/index";
import * as dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { theme } from "./styles/theme";
dayjs.locale("zh-cn");
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
    <ConfigProvider theme={theme} locale={zhCN} autoInsertSpaceInButton={false}>
      <App />
    </ConfigProvider>
    {/* </React.StrictMode> */}
  </Provider>
);

reportWebVitals();
