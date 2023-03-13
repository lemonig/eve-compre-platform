import React, { useState, useEffect } from "react";
import { factorPage, factorUpdate } from "@Api/set_factor_list.js";
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
import { topicList } from "@Api/set_meta_theme.js";
import { CloseOutlined } from "@ant-design/icons";
import "./index.less";
import { throttle } from "@Utils/util";
import { groupList, groupGet } from "@Api/set_factor_group.js";

function FactorSelect({ value = [], onChange }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [themeList, setThemeList] = useState([]);
  const [themed, setThemed] = useState(); //更为站点分组
  const [groupDetail, setGroupDetail] = useState([]);
  const [name, setName] = useState("");

  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    getPageData();
    getThemeList();
  }, []);

  useEffect(() => {
    //FIXME组件创建时value还没值，故这里产生第二次更新
  }, [JSON.stringify(value)]);

  const getThemeList = async () => {
    let { data } = await groupList();
    setThemeList(data);
  };

  const getPageData = async () => {
    console.log("factor select loading");
    let { data } = await factorPage({
      page: 1,
      size: 10000,
    });
    if (value.length > 0) {
      data.forEach((item) => {
        if (value.includes(item.id)) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
      setIndeterminate(true);
      // console.log(data);
    } else if (value.length === data.lenght) {
      setCheckAll(true);
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
    onChange(checkIdList);
    setIndeterminate(!!checkIdList.length && checkIdList.length < data.length);
    setCheckAll(checkIdList.length === data.length);
  };
  const onCheckAllChange = (e) => {
    if (e.target.checked) {
      groupFilter(data).map((item) => (item.checked = true));
    } else {
      groupFilter(data).map((item) => (item.checked = false));
    }
    let checkIdList = data.filter((ele) => ele.checked).map((item) => item.id);
    onChange(checkIdList);
    setData([...data]);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const handleNamechange = (e) => {
    setName(e.target.value);
  };
  const throttleNameChange = throttle(handleNamechange, 500);

  const factorGroupChange = async (e) => {
    console.log(e);
    if (e) {
      let { data: dataIn } = await groupGet({
        id: e,
      });
      console.log(dataIn);
      setGroupDetail(dataIn.factorIdList ?? []);
    } else {
      setGroupDetail([]);
    }
    let checkIdList = data.filter((ele) => ele.checked).map((item) => item.id);
    setIndeterminate(!!checkIdList.length && checkIdList.length < data.length);
  };

  const groupFilter = (data) => {
    return data
      .filter((ele) => groupDetail.includes(ele.id) || !groupDetail.length)
      .filter((ele) => ele.name.includes(name));
  };

  return (
    <>
      <div className="form-factor-content">
        <div>
          <div>可选因子</div>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 12 }}
            autoComplete="off"
            colon={false}
            layout="inline"
          >
            <Form.Item label="因子分组 " name="topicType">
              <Select
                options={themeList}
                placeholder="请选择"
                fieldNames={{
                  label: "name",
                  value: "id",
                }}
                allowClear
                style={{ width: "120px" }}
                onChange={factorGroupChange}
              />
            </Form.Item>
            <Form.Item label=" " name="name">
              <Input
                style={{ width: "120px" }}
                placeholder="因子名称"
                // value={searchVal}
                onChange={throttleNameChange}
              />
            </Form.Item>
          </Form>
          <div style={{ width: "100%", marginTop: "10px" }}>
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
              全选
            </Checkbox>

            <Row
              gutter={24}
              style={{
                width: "100%",
                marginTop: "20px",
                maxHeight: "300px",
                overflow: "auto",
              }}
            >
              {data
                .filter(
                  (ele) => groupDetail.includes(ele.id) || !groupDetail.length
                )
                .filter((ele) => ele.name.includes(name))
                .map((item) => (
                  <Col span={8} key={item.id} style={{ marginBottom: "10px" }}>
                    <Checkbox
                      checked={item.checked}
                      onChange={(e) => onCheckChange(e, item)}
                    >
                      {item.name}
                    </Checkbox>
                  </Col>
                ))}
            </Row>
          </div>
        </div>

        <div>
          <div style={{ marginBottom: "5px" }}>
            <i className="prompt">*</i> 已选因子
          </div>
          <div style={{ maxHeight: "390px", overflowY: "auto" }}>
            {data.map((item) =>
              item.checked ? (
                <div className="checkedList" key={item.id}>
                  {item.name}
                  <CloseOutlined onClick={() => onCheckChange("", item)} />
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default FactorSelect;
