import logo from "./logo.svg";
import "./styles/index.less";
import { BrowserRouter } from "react-router-dom";
import Router from "./router/index";
import React from "react";
import Loading from "./apps/components/Loading";
import "./App.less";

function App() {
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
