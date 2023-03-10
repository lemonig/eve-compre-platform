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
    // ??????
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
    // ??????
    setLoading(false);
  };

  let inputwidtg = {
    width: "300px",
  };

  return (
    <>
      <PageHead
        title={`${record ? "??????" : "??????"}`}
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
            label="??????"
            name="name"
            rules={[
              {
                required: true,
                message: "?????????",
              },
            ]}
            getValueFromEvent={inputTrim}
          >
            <Input placeholder="?????????" className="width-3" />
          </Form.Item>
          <Form.Item
            label="?????????"
            name="enName"
            rules={[
              {
                required: true,
                message: "?????????",
              },
            ]}
          >
            <Input placeholder="?????????" className="width-3" />
          </Form.Item>
          <Form.Item label="????????????" name="topicType">
            <Select
              className="width-3"
              style={inputwidtg}
              options={metaSelect[0]}
              placeholder="?????????"
              fieldNames={{
                label: "name",
                value: "id",
              }}
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="??????"
            name="code"
            rules={[
              {
                required: true,
                message: "?????????",
              },
            ]}
          >
            <Input placeholder="?????????" className="width-3" />
          </Form.Item>
          <Form.Item label="?????????" name="tableName">
            <Input placeholder="?????????" className="width-3" />
          </Form.Item>
          <Form.Item
            label="????????????"
            name="dataFrequency"
            rules={[
              {
                required: true,
                message: "?????????",
              },
            ]}
          >
            <Select
              style={inputwidtg}
              className="width-3"
              options={metaSelect[4]}
              placeholder="?????????"
              fieldNames={{
                label: "dictLabel",
                value: "dictValue",
              }}
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="??????????????????"
            name="needComputeData"
            rules={[
              {
                required: true,
                message: "?????????",
              },
            ]}
          >
            <Select
              style={inputwidtg}
              className="width-3"
              options={[
                {
                  label: "???",
                  value: true,
                },
                {
                  label: "???",
                  value: false,
                },
              ]}
              placeholder="?????????"
            />
          </Form.Item>
          <Form.Item label="????????????" name="computeDataLevel">
            <Select
              className="width-3"
              options={metaSelect[5]}
              placeholder="?????????"
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
          <Form.Item label="????????????" name="evaluationIndex">
            <Select
              style={inputwidtg}
              className="width-3"
              options={metaSelect[2]}
              placeholder="?????????"
              // fieldNames={{
              //   label: "name",
              //   value: "id",
              // }}
              allowClear
              mode="multiple"
              maxTagCount="responsive"
            />
          </Form.Item>
          <Form.Item label="??????????????????" name="stationDataTag">
            <Select
              style={inputwidtg}
              className="width-3"
              options={metaSelect[6]}
              placeholder="?????????"
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
          <Form.Item label="??????????????????" name="stationField">
            <Select
              style={inputwidtg}
              className="width-3"
              options={metaSelect[1]}
              placeholder="?????????"
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
          <Form.Item label="????????????" name="orderNum">
            <Input placeholder="?????????" className="width-3" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 3, span: 19 }}>
            <Button type="primary" htmlType="submit">
              ??????
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
}

export default OpForm;
