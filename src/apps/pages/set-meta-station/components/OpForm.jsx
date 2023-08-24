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
  PageHeader,
  DatePicker,
  Checkbox,
  InputNumber,
} from "antd";
import IconFont from "@Components/IconFont";
import PageHead from "@Components/PageHead";
import {
  stationAdd,
  stationUpdate,
  stationGet,
} from "@Api/set_meta_station.js";
import { inputTrim } from "@Utils/util";

import { metaList } from "@Api/util.js";
import { topicList } from "@Api/set_meta_theme.js";
import { evaluteList } from "@Api/set_meta_evalute.js";
import { fieldList } from "@Api/set_meta_field.js";
import { metadataTypePage } from "@Api/set_meta_data.js";
const { Option } = Select;

function OpForm({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [metaSelect, setMetaSelect] = useState([]);
  const [computeDataLevel, setComputeDataLevel] = useState([]); //汇聚级别

  useEffect(() => {
    Promise.all([
      getMetaData1(),
      getMetaData2(),
      getMetaData3(),
      getMetaData4(),
      getMetaData5(),
      getMetaData6(),
      getMetaData7(),
      getMetaData8(),
      getMetaData9(),
    ]).then((res) => {
      setMetaSelect(res);
      setTimeout(() => {
        if (!!record) {
          getDetail(res);
        }
      });
    });
  }, []);

  const getDetail = async (res) => {
    let { data } = await stationGet({
      id: record.id,
    });
    let index = res[5]?.findIndex(
      (ele) => ele.dictValue === data.dataFrequency
    );
    let selectop = res[5]?.map((item, idx) => ({
      ...item,
      disabled: idx > index ? false : true,
    }));
    setComputeDataLevel(selectop);
    form.setFieldsValue(data);
  };

  const getMetaData1 = async () => {
    let { data } = await topicList();
    return data;
  };

  const getMetaData2 = async () => {
    let { data } = await fieldList();
    let newData = data.filter((ele) => !ele.isCommon);

    return newData;
  };

  const getMetaData3 = async () => {
    let { data } = await evaluteList();
    // let newData = data.map((item) => ({
    //   value: item.id,
    //   label: item.name + "--" + item.remark,
    // }));
    // return newData;
    return data;
  };

  const getMetaData4 = async () => {
    let { data } = await metadataTypePage();
    return data;
  };
  const getMetaData5 = async () => {
    let { data } = await metaList({
      dictType: "data_frequency",
    });

    return data;
  };
  const getMetaData6 = async () => {
    let { data } = await metaList({
      dictType: "compute_data_level",
    });
    let nData = data.map((item) => {
      if (item.dictValue === "mm" || item.dictValue === "hh") {
        return item;
      }
      return {
        ...item,
        disabled: true,
      };
    });
    return nData;
  };
  const getMetaData7 = async () => {
    let { data } = await metaList({
      dictType: "station_data_tag",
    });
    let newData = data.map((item) => ({
      value: item.dictValue,
      label: item.dictLabel + "--" + item.remark,
    }));

    return newData;
  };

  const getMetaData8 = async () => {
    let { data } = await metaList({
      dictType: "avg_algorithm",
    });
    return data;
  };

  const getMetaData9 = async () => {
    let { data } = await metaList({
      dictType: "day_avg_hour_range",
    });
    return data;
  };

  const onFinish = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);
    // 编辑
    if (record) {
      values.id = record.id;
      let { success, message: msg } = await stationUpdate(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      } else {
        message.error(msg);
      }
    } else {
      let { success, message: msg } = await stationAdd(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      } else {
        message.error(msg);
      }
    }
    // 添加
    setLoading(false);
  };

  let inputwidtg = {
    width: "300px",
  };
  const onDataFrequencyChange = (e) => {
    let index = metaSelect[5].findIndex((ele) => ele.dictValue === e);
    let formVal = form.getFieldValue("computeDataLevel");
    let selectop = metaSelect[5].map((item, idx) => ({
      ...item,
      disabled: idx > index ? false : true,
    }));
    setComputeDataLevel(selectop);
    // console.log(form.getFieldValue("computeDataLevel"));
    form.setFieldsValue({
      computeDataLevel: [],
    });
  };

  return (
    <>
      <PageHead
        title={`${record ? "编辑" : "新建"}`}
        onClick={() => closeModal(false)}
      />
      {open && (
        <Form
          name="basic"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 19 }}
          autoComplete="off"
          form={form}
          colon={false}
          onFinish={onFinish}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[
              {
                required: true,
                message: "请输入",
              },
            ]}
            getValueFromEvent={inputTrim}
          >
            <Input placeholder="请输入" className="width-3" />
          </Form.Item>
          <Form.Item
            label="英文名"
            name="enName"
            rules={[
              {
                required: true,
                message: "请输入",
              },
            ]}
          >
            <Input placeholder="请输入" className="width-3" />
          </Form.Item>
          <Form.Item
            label="业务主题"
            name="topicType"
            rules={[
              {
                required: true,
                message: "请选择",
              },
            ]}
          >
            <Select
              style={inputwidtg}
              options={metaSelect[0]}
              placeholder="请选择"
              fieldNames={{
                label: "name",
                value: "id",
              }}
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="编码"
            name="code"
            rules={[
              {
                required: true,
                message: "请输入",
              },
            ]}
          >
            <Input placeholder="请输入" className="width-3" />
          </Form.Item>
          {/* <Form.Item label="数据表" name="tableName">
            <Input placeholder="请输入" className="width-3" />
          </Form.Item> */}
          <Form.Item
            label="数据频次"
            name="dataFrequency"
            rules={[
              {
                required: true,
                message: "请输入",
              },
            ]}
          >
            <Select
              style={inputwidtg}
              options={metaSelect[5]}
              placeholder="请选择"
              fieldNames={{
                label: "dictLabel",
                value: "dictValue",
              }}
              allowClear
              onChange={onDataFrequencyChange}
            />
          </Form.Item>
          <Form.Item
            label="是否汇聚数据"
            name="needComputeData"
            rules={[
              {
                required: true,
                message: "请输入",
              },
            ]}
          >
            <Select
              style={inputwidtg}
              options={[
                {
                  label: "是",
                  value: true,
                },
                {
                  label: "否",
                  value: false,
                },
              ]}
              placeholder="请选择"
            />
          </Form.Item>
          <Form.Item label="汇聚级别" name="computeDataLevel">
            <Select
              options={computeDataLevel}
              placeholder="请选择"
              fieldNames={{
                label: "dictLabel",
                value: "dictValue",
              }}
              style={inputwidtg}
              allowClear
              mode="multiple"
              maxTagCount="responsive"
            />
          </Form.Item>
          <Form.Item
            label="均值算法"
            name="avgAlgorithm"
            rules={[
              {
                required: true,
                message: "请选择",
              },
            ]}
          >
            <Select placeholder="请选择" style={inputwidtg}>
              {metaSelect[7]?.map((item) => (
                <Option
                  value={item.dictValue}
                  key={item.dictValue}
                  title={item.remark}
                >
                  <Space>
                    {item.dictLabel}-
                    <span role="img" aria-label={item.name}>
                      {item.remark}
                    </span>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="小时值、日均值统计时段"
            name="dayAvgHourRange"
            rules={[
              {
                required: true,
                message: "请选择",
              },
            ]}
          >
            <Select className="width-3" placeholder="请选择" style={inputwidtg}>
              {metaSelect[8]?.map((item) => (
                <Option
                  value={item.dictValue}
                  key={item.dictValue}
                  title={item.remark}
                >
                  <Space>
                    {item.dictLabel}-
                    <span role="img" aria-label={item.dictLabel}>
                      {item.remark}
                    </span>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="评价指标" name="evaluationIndex">
            <Select
              style={inputwidtg}
              // options={metaSelect[2]}
              placeholder="请选择"
              // fieldNames={{
              //   label: "name",
              //   value: "id",
              // }}
              allowClear
              mode="multiple"
              maxTagCount="responsive"
              optionLabelProp="label"
            >
              {metaSelect[2]?.map((item) => (
                <Option value={item.id} label={item.name} key={item.id}>
                  <Space>
                    <span role="img" aria-label={item.name}>
                      {item.remark}
                    </span>
                    {item.name}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="站点数据标记" name="stationDataTag">
            <Select
              style={inputwidtg}
              options={metaSelect[6]}
              placeholder="请选择"
              // fieldNames={{
              //   label: "dictLabel",
              //   value: "dictValue",
              // }}
              allowClear
              mode="multiple"
              maxTagCount="responsive"
              maxTagTextLength={6}
            />
          </Form.Item>
          <Form.Item label="站点属性字段" name="stationField">
            <Select
              style={inputwidtg}
              options={metaSelect[1]}
              placeholder="请选择"
              fieldNames={{
                label: "name",
                value: "id",
              }}
              allowClear
              mode="multiple"
              maxTagCount="responsive"
              maxTagTextLength={6}
            />
          </Form.Item>
          <Form.Item label="展示次序" name="orderNum">
            <InputNumber
              min={0}
              max={99999}
              formatter={(value) => `${value}`.replace(/[^0-9]/g, "")} // 格式化显示为整数
              parser={(value) => parseInt(value || "0", 10)} // 将输入解析为整数值
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 3, span: 19 }}>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
}

export default OpForm;
