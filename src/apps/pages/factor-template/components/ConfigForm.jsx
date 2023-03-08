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
import { settingGet, settingUpdate } from "@Api/set_factor_template.js";

function ConfigForm({ record, open, closeModal }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = async () => {
    let { data } = await settingGet({
      id: record.code,
    });
    setData(data);
  };

  const handleOk = async () => {
    setLoading(true);
    // 编辑
    let { success, message: msg } = await settingUpdate({
      id: record.code,
      list: data,
    });
    if (success) {
      message.success(msg);
      closeModal(true);
    } else {
      message.error(msg);
    }

    // 添加
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  let inputwidtg = {
    width: "300px",
  };
  const style = {
    fontFamily: "16px",
    fontWeight: "bold",
  };
  let textRight = {
    textAlign: "right",
  };

  const handleInputChange = (e, detail) => {
    if (e !== null) {
      detail.dailyCount = e;
    }
    setData([...data]);
  };

  const handleCheckChange = (e, detail) => {
    detail.needEvaluation = e.target.checked;
    setData([...data]);
  };

  return (
    <>
      <Modal
        title={`配置因子模板`}
        open={open}
        onOk={handleOk}
        onCancel={() => closeModal(false)}
        maskClosable={false}
        width={500}
        confirmLoading={loading}
      >
        <div>
          <Row
            gutter={24}
            style={{ margin: "16px 0 8px 0" }}
            align="middle "
            justify="center"
          >
            <Col className="gutter-row" span={8}>
              <div style={style}>因子</div>
            </Col>
            <Col className="gutter-row" span={9}>
              <div style={style}>每日上报数据条数</div>
            </Col>
            {/* <Col span={3}></Col> */}
            <Col
              className="gutter-row"
              span={7}
              style={{ textAlign: "center" }}
            >
              <div style={style}>评价因子</div>
            </Col>
          </Row>
          <div style={{ maxHeight: "600px", overflow: "auto" }}>
            {data.map((item, idx) => (
              <Row
                gutter={24}
                key={idx}
                style={{ margin: "8px 0" }}
                align="middle "
                justify="center"
              >
                <Col className="gutter-row" span={8}>
                  {item.factorName}
                </Col>
                <Col className="gutter-row" span={6}>
                  <InputNumber
                    min={0}
                    max={1441}
                    value={item.dailyCount}
                    onChange={(value) => handleInputChange(value, item)}
                    style={{ width: "100%" }}
                  ></InputNumber>
                </Col>
                <Col className="gutter-row" span={3}>
                  条/天
                </Col>
                <Col
                  className="gutter-row"
                  span={7}
                  style={{ textAlign: "center" }}
                >
                  <Checkbox
                    checked={item.needEvaluation}
                    onChange={(value) => handleCheckChange(value, item)}
                  />
                </Col>
              </Row>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ConfigForm;
