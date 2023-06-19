import React, { useEffect, useState } from "react";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import {
  Button,
  Space,
  Form,
  Input,
  Upload,
  message,
  Radio,
  Checkbox,
  Select,
  Transfer,
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { settingGet, settingUpdate } from "@Api/set_base.js";
import PageHead from "@Components/PageHead";
import GroupCreate from "../components/GroupCreate";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const mockData = Array.from({
  length: 20,
}).map((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
  description: `description of content${i + 1}`,
}));
const initialTargetKeys = mockData
  .filter((item) => Number(item.key) > 10)
  .map((item) => item.key);

const creatMonth = () => {
  let res = [];
  for (let i = 1; i < 12; i++) {
    res.push({
      value: i,
      label: i + "月",
    });
  }
  return res;
};

function AlarmGroup({ record, open, closePage }) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [form] = Form.useForm();
  const [targetKeys, setTargetKeys] = useState(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    getPageData();
  }, []);
  const getPageData = async () => {
    let { data } = await settingGet();
    form.setFieldsValue(data);
    setImageUrl(data.header_logo);
  };

  const onFinish = async (values) => {
    console.log("Success:", values);
    values.header_logo = imageUrl;
    let { success, message: msg } = await settingUpdate(values);
    if (success) {
      message.success(msg);
    } else {
      message.error(msg);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传
      </div>
    </div>
  );

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      if (info.file.response.data.url) {
        setLoading(false);
        setImageUrl(info.file.response.data.url);
      }
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} 上传失败`);
    }
  };

  const deleteLogo = () => {
    setImageUrl("");
  };

  // 穿梭
  const onChange = (nextTargetKeys, direction, moveKeys) => {
    console.log("targetKeys:", nextTargetKeys);
    console.log("direction:", direction);
    console.log("moveKeys:", moveKeys);
    setTargetKeys(nextTargetKeys);
  };
  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    console.log("sourceSelectedKeys:", sourceSelectedKeys);
    console.log("targetSelectedKeys:", targetSelectedKeys);
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };
  const onScroll = (direction, e) => {
    console.log("direction:", direction);
    console.log("target:", e.target);
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

  return (
    <>
      <div className="content-wrap">
        <Lbreadcrumb data={["系统设置", "数据报警", "报警规则"]} />
        <PageHead title="创建规则组" onClick={() => closePage(true)} />
        <h2 className="second-title ">基本信息</h2>
        <Form
          name="basic"
          form={form}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          colon={false}
        >
          <Form.Item
            label="规则组名称"
            name="company_name"
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
            label="生效月份"
            rules={[
              {
                required: true,
                message: "请选择",
              },
            ]}
          >
            <Space>
              <Form.Item
                name={["address", "province"]}
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
                name={["address", "street"]}
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
            name="company_name"
            rules={[
              {
                required: true,
                message: "请输入",
              },
            ]}
          >
            <Transfer
              dataSource={mockData}
              titles={["未选", "已选"]}
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              onChange={onChange}
              onSelectChange={onSelectChange}
              onScroll={onScroll}
              render={(item) => item.title}
              footer={renderFooter}
            />
          </Form.Item>

          <h2 className="second-title ">消息通知</h2>
          <Form.Item name="rad" label="通知方式">
            <Checkbox.Group>
              <Checkbox value="1">短信通知</Checkbox>
              <Checkbox value="2">微信通知</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item name="通知时间" label="通知时间">
            <Radio.Group>
              <Radio value="a">实时</Radio>
              <Radio value="b">定时</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="radio-group" label="通知人员">
            <Checkbox.Group>
              <Checkbox value="1">超标联系人</Checkbox>
              <Checkbox value="2">运维联系人</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item name="通知时间" label="通知内容">
            <Radio.Group>
              <Radio value="a">精简</Radio>
              <Radio value="b">完整</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <p>
              精简版：【站点名称】+【因子】+【规则名称】+【@站点运维】
              例如：栟茶运河栟茶河二桥pH值连续值@张三
              完整版：【站点名称】+【mm月dd日hh时】+【报警描述】+【累计次数】+【监测值】+【@站点运维】
              例如：栟茶运河栟茶河二桥12月22日07时pH值连续值，累计2次(7.55)@张三
            </p>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </div>
      {/* 弹出表单 */}
      {isModalOpen && (
        <GroupCreate
          open={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          // record={operate}
        />
      )}
    </>
  );
}

export default AlarmGroup;
