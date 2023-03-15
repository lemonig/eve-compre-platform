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
  Tooltip,
  Switch,
  Checkbox,
  Divider,
  Col,
  Row,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./index.less";
import { getFactor } from "@Api/data-list.js";
import { SettingOutlined } from "@ant-design/icons";

function FiledSelect({ value = [], onChange, menuKey }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visable, setVisable] = useState(false);

  useEffect(() => {
    getPageData();
  }, []);

  useEffect(() => {
    //FIXME组件创建时value还没值，故这里产生第二次更新
  }, [JSON.stringify(value)]);

  const getPageData = async () => {
    console.log(" select loading");
    console.log(menuKey);
    let { data } = await getFactor({
      id: "1",
    });
    if (value.length > 0) {
      data.forEach((item) => {
        if (value.includes(item.id)) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
      // console.log(data);
    } else if (value.length === data.lenght) {
    }
    setData(data);
  };

  const onCheckChange = (e, item) => {
    if ("checked" in item) {
      item.checked = !item.checked;
    } else {
      item.checked = true;
    }
    setData([...data]);
    let checkIdList = data.filter((ele) => ele.checked).map((item) => item.id);
  };

  return (
    <>
      <SettingOutlined onClick={() => setVisable(true)} />
      <Modal
        title={`设置显示字段`}
        // onOk={handleOk}
        onCancel={() => {
          setVisable(false);
        }}
        open={visable}
        maskClosable={false}
        width={800}
        confirmLoading={loading}
      >
        <div className="form-factor-content">
          <div>
            <fieldset>
              <legend>监测因子</legend>
              <div style={{ width: "100%" }}>
                <Row
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    overflow: "auto",
                  }}
                >
                  {data.map((item, idx) => (
                    <Col
                      span={6}
                      key={item.id + idx}
                      style={{ marginBottom: "10px" }}
                    >
                      <Checkbox
                        checked={item.checked}
                        onChange={(e) => onCheckChange(e, item)}
                      >
                        {item.label}
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </div>
            </fieldset>
          </div>

          <div>
            <div style={{ marginBottom: "5px" }}>
              <i className="prompt">*</i> 当前选定字段
            </div>
            <div style={{ maxHeight: "390px", overflowY: "auto" }}>
              {data.map((item, idx) =>
                item.checked ? (
                  <div className="checkedList" key={item.id + idx}>
                    {item.label}
                    <CloseOutlined onClick={() => onCheckChange("", item)} />
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default FiledSelect;
