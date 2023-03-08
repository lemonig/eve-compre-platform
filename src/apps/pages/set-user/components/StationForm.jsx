import React, { useState, useEffect } from "react";
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
  Col,
  Divider,
  Row,
  Checkbox,
  InputNumber,
} from "antd";
import IconFont from "@Components/IconFont";
import FactorSelect from "@Components/FactorSelect";
import PageHead from "@Components/PageHead";
import { roleList as getroleList } from "@Api/util.js";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import { inputTrim } from "@Utils/util";

import StationSelect from "@Components/StationSelect";
import { stationPage } from "@Api/set_station.js";

function StationForm({ list, open, onOK, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [idList, setIdList] = useState([]);
  const [stationList, setStationList] = useState([]);

  useEffect(() => {
    getStationList();
  }, []);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onStationChange = (id) => {
    console.log(id);
    setIdList(id);
  };

  const getStationList = async () => {
    const { data } = await stationPage({
      page: 1,
      size: 10000,
    });
    let idata = data.map((item, idx) => ({
      ...item,
      idx: idx + 1,
      key: item.id,
    }));
    setStationList(idata);
  };

  return (
    <>
      <Modal
        title={`选择站点`}
        open={open}
        onOk={() => onOK(idList)}
        onCancel={onCancel}
        maskClosable={false}
        width={888}
        confirmLoading={loading}
      >
        <div>
          <StationSelect
            onChange={onStationChange}
            value={list}
            options={stationList}
          />
        </div>
      </Modal>
    </>
  );
}

export default StationForm;
