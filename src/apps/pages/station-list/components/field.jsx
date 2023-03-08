import React from "react";
import {
  Input,
  Select,
  Button,
  Space,
  Table,
  Tag,
  Modal,
  Form,
  message,
  Tooltip,
  PageHeader,
  DatePicker,
  Checkbox,
} from "antd";
import IconFont from "@Components/IconFont";
import { inputTrim } from "@Utils/util";
// api
import { topicList } from "@Api/set_meta_theme.js";
import { stationPage as stationMetaPage } from "@Api/set_meta_station.js";

let inputwidtg = {
  width: "300px",
};

export const geBaseFields = async (type) => {};

export const getPosFields = async (type) => {
  switch (type) {
    case "topic_type":
      // code block
      break;

    default:
    // code block
  }
};
export const getFactorFields = async (type) => {
  switch (type) {
    case "topic_type":
      // code block
      break;

    default:
    // code block
  }
};
