import React, { useState, useEffect } from "react";
import { Input, Select, Modal, Form, message, InputNumber } from "antd";
import { inputTrim } from "@Utils/util";
import FactorSelectModal from "./FactorSelectModal";
import {
  listRule,
  getParametersByRuleCode,
  addContent,
  updateContent,
  getContent,
  getAlarmComparisonOperator,
  getAlarmDataType,
} from "@Api/set_alarm.js";
import { waterList, airList } from "./staticVal";

function RuleForm({ record, open, closeModal, groupId }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState([]); //规则类型
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [factorId, setFactorId] = useState([]); //已选因子
  const [factorFile, setFactorFile] = useState([]); //表单字段
  const [symbol, setSymbol] = useState([]); //单位
  const [timeType, setTimeType] = useState([]);
  useEffect(() => {
    getMetaData();
  }, []);

  const getRuleDetail = async () => {
    let { data } = await getContent({
      id: record.id,
    });
    onRuleCodeChange(data.ruleCode);
    form.setFieldsValue({ ...data });
    setFactorId(data.factorIds);
  };

  const getMetaData = async () => {
    let { data } = await listRule();
    setMeta(data);
    let { data: data1 } = await getAlarmComparisonOperator();
    setSymbol(data1);
    let { data: data2 } = await getAlarmDataType();
    setTimeType(data2);

    if (record) {
      getRuleDetail();
    }
  };

  const handleOk = async () => {
    await form.validateFields();

    const values = form.getFieldsValue();
    values.factorIds = factorId;
    setLoading(true);
    let params = {};
    factorFile.forEach((item) => {
      Reflect.defineProperty(params, item, {
        value: values[item],
        enumerable: true,
      });
    });
    params.ruleGroupId = groupId;
    params.ruleCode = values.ruleCode;
    params.name = values.name;

    // 编辑
    if (record?.id) {
      params.id = record.id;
      let { success, message: msg } = await updateContent(params);
      if (success) {
        message.success(msg);
        closeModal(true);
      }
    } else {
      let { success, message: msg } = await addContent(params);
      if (success) {
        message.success(msg);
        closeModal(true);
      }
    }
    // 添加
    setLoading(false);
  };

  // 添加因子
  const factorSelectCallback = (value) => {
    if (typeof value === "boolean") {
      setIsModalOpen(false);
    } else {
      setFactorId(value);
      setIsModalOpen(false);
    }
  };

  const onRuleCodeChange = async (value) => {
    let option = meta.find((ele) => ele.code === value);
    if (option) {
      form.setFieldsValue({
        name: option.name,
      });
    }

    let { data } = await getParametersByRuleCode({
      code: value,
    });

    setFactorFile(data);
  };

  const filterElement = (name) => ({
    display: factorFile.find((ele) => ele === name) ? "block" : "none",
  });
  const filterRequire = (name) => factorFile.find((ele) => ele === name);

  const validatFactor = (flag, value) => {
    if (flag && factorId.length === 0) {
      return Promise.reject(new Error("请选择"));
    }
    return Promise.resolve();
  };

  return (
    <>
      <Modal
        title={record ? "编辑" : "新建"}
        open={open}
        onOk={handleOk}
        onCancel={() => closeModal(false)}
        maskClosable={false}
        confirmLoading={loading}
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          autoComplete="off"
          form={form}
          colon={false}
          initialValues={{
            continuousCount: 1,
            comparisonOperator: "1",
            airLevel: 2,
            wtLevel: 0,
            percentage: 100,
            dataType: "hh",
          }}
        >
          <Form.Item
            label="规则类型"
            name="ruleCode"
            rules={[
              {
                required: true,
                message: "请输入",
              },
            ]}
          >
            <Select
              options={meta}
              placeholder="请选择"
              fieldNames={{
                label: "name",
                value: "code",
              }}
              onChange={onRuleCodeChange}
            />
          </Form.Item>
          <Form.Item
            label="规则名称"
            name="name"
            rules={[
              {
                required: true,
                message: "请输入",
              },
            ]}
            getValueFromEvent={inputTrim}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          {/* 零值 负值 连续*/}

          <Form.Item
            label={<span>因子 &nbsp;</span>}
            style={filterElement("factorIds")}
            required
          >
            <span className="ant-form-text">已选择{factorId.length}个因子</span>
            <Form.Item
              name="factorIds"
              noStyle
              rules={[
                {
                  required: filterRequire("factorIds"),
                  validator: () => validatFactor(filterRequire("factorIds")),
                },
              ]}
            >
              <a onClick={() => setIsModalOpen(true)}>选择因子</a>
            </Form.Item>
          </Form.Item>

          <Form.Item
            style={filterElement("dataType")}
            label="数据类型"
            name="dataType"
            rules={[
              {
                required: filterRequire("filterRequire"),
                message: "请选择",
              },
            ]}
          >
            <Select
              options={timeType}
              placeholder="请选择"
              fieldNames={{
                label: "value",
                value: "code",
              }}
            />
          </Form.Item>

          <Form.Item
            style={filterElement("continuousCount")}
            label="连续次数"
            name="continuousCount"
            rules={[
              {
                required: filterRequire("continuousCount"),
                message: "请输入",
              },
            ]}
          >
            <InputNumber placeholder="请输入" min={1} max={999999} />
          </Form.Item>

          <Form.Item
            style={filterElement("durationPeriod")}
            label="持续周期"
            name="durationPeriod"
            rules={[
              {
                required: filterRequire("durationPeriod"),
                message: "请输入",
              },
            ]}
          >
            <InputNumber placeholder="请输入" min={1} max={999999} />
          </Form.Item>

          <Form.Item
            style={filterElement("wtLevel")}
            label="水质类别"
            name="wtLevel"
            rules={[
              {
                required: filterRequire("wtLevel"),
                message: "请选择",
              },
            ]}
          >
            <Select options={waterList} placeholder="请选择" />
          </Form.Item>

          <Form.Item
            style={filterElement("airLevel")}
            label="空气质量等级"
            name="airLevel"
            rules={[
              {
                required: filterRequire("airLevel"),
                message: "请选择",
              },
            ]}
          >
            <Select options={airList} placeholder="请选择" />
          </Form.Item>

          <Form.Item label="百分比" style={filterElement("percentage")}>
            <Form.Item
              name="percentage"
              noStyle
              rules={[
                {
                  required: filterRequire("percentage"),
                  message: "请输入",
                },
              ]}
            >
              <InputNumber min={0} max={999999} />
            </Form.Item>
            <span
              className="ant-form-text"
              style={{
                marginLeft: 8,
              }}
            >
              %
            </span>
          </Form.Item>

          <Form.Item
            style={filterElement("comparisonOperator")}
            label="比较符号"
            name="comparisonOperator"
            rules={[
              {
                required: filterRequire("comparisonOperator"),
                message: "请选择",
              },
            ]}
          >
            <Select
              options={symbol}
              placeholder="请选择"
              fieldNames={{
                label: "value",
                value: "code",
              }}
            />
          </Form.Item>

          <Form.Item
            label="自定义限值"
            style={filterElement("exceedLimit")}
            required
          >
            <Form.Item
              name="exceedLimit"
              noStyle
              rules={[
                {
                  required: filterRequire("exceedLimit"),
                  message: "请输入",
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
          </Form.Item>
          <Form.Item
            label="离群倍数"
            style={filterElement("outlierMultiple")}
            required
          >
            <Form.Item
              name="outlierMultiple"
              noStyle
              rules={[
                {
                  required: filterRequire("outlierMultiple"),
                  message: "请输入",
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>

      {/* 弹出表单 */}
      {isModalOpen && (
        <FactorSelectModal
          open={isModalOpen}
          factorSelectCallback={factorSelectCallback}
          record={factorId}
        />
      )}
    </>
  );
}

export default RuleForm;
