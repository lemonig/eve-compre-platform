import * as React from "react";
import { useRoutes } from "react-router-dom";
import config from './config';

function Config() {
  let element = useRoutes(config)
  return element

}

export default Config