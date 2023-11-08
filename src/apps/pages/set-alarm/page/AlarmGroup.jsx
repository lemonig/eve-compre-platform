import React, { useEffect, useState } from "react";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import {
  Button,
  Space,
  Form,
  Input,
  message,
  Radio,
  Checkbox,
  Select,
  Transfer,
} from "antd";
import PageHead from "@Components/PageHead";
import GroupCreate from "../components/GroupCreate";

import { addGroup, updateGroup, getGroup } from "@Api/set_alarm_rule.js";

import { pageGroup as stationPageGroup } from "@Api/set_alarm_station.js";

// 月份选项
const creatMonth = () => {
  let res = [];
  for (let i = 1; i <= 12; i++) {
    res.push({
      value: i,
      label: i + "月",
    });
  }
  return res;
};
const creatHour = () => {
  let res = [];
  for (let i = 0; i <= 23; i++) {
    res.push({
      value: String(i),
      label: i + "时",
    });
  }
  return res;
};

function AlarmGroup({ record, open, closePage }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stationGroup, setStationGroup] = useState([]); //站点组
  const enableWxNotification = Form.useWatch("enableWxNotification", form);
  const enableDingtalkNotification = Form.useWatch(
    "enableDingtalkNotification",
    form
  );
  const isScheduledSend = Form.useWatch("isScheduledSend", form);
  useEffect(() => {
    if (record) {
      getRuleDetail(record);
    }
    getStationGroup();
  }, []);

  // 获取详情
  const getRuleDetail = async (record) => {
    let { data } = await getGroup({
      id: record.id,
    });
    form.setFieldsValue(data);
    setTargetKeys(data.stationGroupIds);
  };

  //获取站点组
  const getStationGroup = async () => {
    let { data } = await stationPageGroup({
      page: 1,
      size: 9999,
    });
    let nData = data.map((item) => ({
      ...item,
      id: String(item.id),
      key: String(item.id),
    }));
    setStationGroup(nData);
  };

  const onFinish = async () => {
    // await form.validateFields();
    const values = form.getFieldsValue();
    let params = JSON.parse(JSON.stringify(values));
    params.enableSmsNotification = params.enableSmsNotification ? 1 : 0;
    params.enableWxNotification = params.enableWxNotification ? 1 : 0;
    params.enableDingtalkNotification = params.enableDingtalkNotification
      ? 1
      : 0;
    params.exceededContact = params.exceededContact ? 1 : 0;
    params.operationContact = params.operationContact ? 1 : 0;
    setLoading(true);
    // 编辑
    if (record?.id) {
      params.id = record.id;
      let { success, message: msg } = await updateGroup(params);
      if (success) {
        message.success(msg);
        closePage(true);
      }
    } else {
      let { success, message: msg } = await addGroup(params);
      if (success) {
        message.success(msg);
        closePage(true);
      }
    }
    // 添加
    setLoading(false);
  };

  // 穿梭
  const onTransferChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const addStationGroup = () => {
    setIsModalOpen(true);
  };
  const renderFooter = (_, { direction }) => {
    if (direction === "left") {
      return (
        <div
          style={{
            textAlign: "center",
          }}
        >
          <Button type="link" onClick={addStationGroup}>
            创建站点分组
          </Button>
        </div>
      );
    }
  };

  const closeStationModal = () => {
    setIsModalOpen(false);
    getStationGroup();
  };

  // 定时通知只支持精简
  useEffect(() => {
    if (isScheduledSend) {
      form.setFieldsValue({
        notificationFormat: 1,
      });
    }
  }, [isScheduledSend]);
  return (
    <>
      <div className="content-wrap">
        <Lbreadcrumb data={["系统设置", "数据报警", "报警规则"]} />
        <PageHead
          title={`${record ? "编辑" : "创建"}规则组`}
          onClick={() => closePage(false)}
        />
        <h2 className="second-title ">基本信息</h2>
        <Form
          name="basic"
          form={form}
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 19,
          }}
          style={{
            maxWidth: 1000,
          }}
          onFinish={onFinish}
          autoComplete="off"
          colon={false}
          initialValues={{
            isScheduledSend: 0,
            notificationFormat: 1,
            important_degree: "一般",
            beginMonth: 1,
            endMonth: 12,
          }}
        >
          <Form.Item
            label="规则组名称"
            name="name"
            rules={[
              {
                required: true,
                message: "请输入",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="重要程度"
            name="important_degree"
            rules={[
              {
                required: true,
                message: "请输入",
              },
            ]}
          >
            <Radio.Group>
              <Radio value="一般">一般</Radio>
              <Radio value="重要">重要</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="生效月份" required>
            <Space>
              <Form.Item
                name="beginMonth"
                noStyle
                rules={[
                  {
                    required: true,
                    message: "请选择",
                  },
                ]}
              >
                <Select placeholder="请选择" options={creatMonth()}></Select>
              </Form.Item>
              至
              <Form.Item
                name={["endMonth"]}
                noStyle
                rules={[
                  {
                    required: true,
                    message: "请选择",
                  },
                ]}
              >
                <Select placeholder="请选择" options={creatMonth()}></Select>
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item
            label="报警站点组"
            name="stationGroupIds"
            rules={[
              {
                required: true,
                message: "请选择",
              },
            ]}
          >
            <Transfer
              dataSource={stationGroup}
              titles={["未选", "已选"]}
              targetKeys={targetKeys}
              // selectedKeys={selectedKeys}
              onChange={onTransferChange}
              // onSelectChange={onSelectChange}
              // onScroll={onScroll}
              render={(item) => item.name}
              footer={renderFooter}
              rowKey={(record) => record.id}
            />
          </Form.Item>

          <h2 className="second-title ">消息通知</h2>
          <Form.Item label="通知方式">
            <Space>
              <Form.Item name="enableSmsNotification" valuePropName="checked">
                <Checkbox>短信通知</Checkbox>
              </Form.Item>

              <Form.Item name="enableWxNotification" valuePropName="checked">
                <Checkbox>微信通知</Checkbox>
              </Form.Item>
              {enableWxNotification ? (
                <Form.Item
                  label="微信群聊名称"
                  name="wechatGroupName"
                  colon={true}
                >
                  <Input></Input>
                </Form.Item>
              ) : null}
              <Form.Item
                name="enableDingtalkNotification"
                valuePropName="checked"
              >
                <Checkbox>钉钉通知</Checkbox>
              </Form.Item>

              {enableDingtalkNotification ? (
                <Form.Item
                  label="钉钉群聊名称"
                  name="dingtalkGroupName"
                  colon={true}
                >
                  <Input></Input>
                </Form.Item>
              ) : null}
            </Space>
          </Form.Item>
          <Form.Item label="通知时间">
            <Space>
              <Form.Item name="isScheduledSend">
                <Radio.Group>
                  <Radio value={0}>实时</Radio>
                  <Radio value={1}>定时</Radio>
                </Radio.Group>
              </Form.Item>

              {isScheduledSend ? (
                <Form.Item name="scheduledHour" colon={true}>
                  <Select
                    placeholder="请选择"
                    mode="multiple"
                    options={creatHour()}
                    style={{ width: 120 }}
                    maxTagCount="responsive"
                    allowClear
                  ></Select>
                </Form.Item>
              ) : null}
            </Space>
          </Form.Item>
          <Form.Item label="通知人员">
            <Space>
              <Form.Item name="exceededContact" valuePropName="checked">
                <Checkbox>超标联系人</Checkbox>
              </Form.Item>
              <Form.Item name="operationContact" valuePropName="checked">
                <Checkbox>运维联系人</Checkbox>
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item name="notificationFormat" label="通知内容">
            <Radio.Group>
              <Radio value={1}>精简</Radio>
              {!isScheduledSend ? <Radio value={2}>完整</Radio> : null}
            </Radio.Group>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 5,
              span: 16,
            }}
          >
            <p style={{ color: "rgba(0,0,0,0.5)" }}>
              精简版：【站点名称】+【因子】+【规则名称】+【@站点运维】
              <p>例如：栟茶运河栟茶河二桥pH值连续值@张三</p>
              <p>
                完整版：【站点名称】+【mm月dd日hh时】+【报警描述】+【累计次数】+【监测值】+【@站点运维】
              </p>
              例如：栟茶运河栟茶河二桥12月22日07时pH值连续值，累计2次(7.55)@张三
            </p>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 5,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" loading={loading}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </div>
      {/* 弹出表单 */}
      {isModalOpen && (
        <GroupCreate
          open={isModalOpen}
          closeModal={closeStationModal}
          // record={operate}
        />
      )}
    </>
  );
}

export default AlarmGroup;
