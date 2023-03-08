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

function OpForm({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [metaSelect, setMetaSelect] = useState([]);

  useEffect(() => {
    Promise.all([
      getMetaData1(),
      getMetaData2(),
      getMetaData3(),
      getMetaData4(),
      getMetaData5(),
      getMetaData6(),
      getMetaData7(),
    ]).then((res) => {
      setMetaSelect(res);
      setTimeout(() => {
        if (!!record) {
          getDetail();
        }
      });
    });
  }, []);

  const getDetail = async () => {
    let { data } = await stationGet({
      id: record.id,
    });
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
    let newData = data.map((item) => ({
      value: item.id,
      label: item.name + "--" + item.remark,
    }));
    return newData;
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
    return data;
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
          <Form.Item label="业务主题" name="topicType">
            <Select
              className="width-3"
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
          <Form.Item label="数据表" name="tableName">
            <Input placeholder="请输入" className="width-3" />
          </Form.Item>
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
              className="width-3"
              options={metaSelect[4]}
              placeholder="请选择"
              fieldNames={{
                label: "dictLabel",
                value: "dictValue",
              }}
              allowClear
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
              className="width-3"
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
              className="width-3"
              options={metaSelect[5]}
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
          <Form.Item label="评价指标" name="evaluationIndex">
            <Select
              style={inputwidtg}
              className="width-3"
              options={metaSelect[2]}
              placeholder="请选择"
              // fieldNames={{
              //   label: "name",
              //   value: "id",
              // }}
              allowClear
              mode="multiple"
              maxTagCount="responsive"
            />
          </Form.Item>
          <Form.Item label="站点数据标记" name="stationDataTag">
            <Select
              style={inputwidtg}
              className="width-3"
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
              className="width-3"
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
            <Input placeholder="请输入" className="width-3" />
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
