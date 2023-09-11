import React, { useEffect, useState } from "react";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import { Button, Space, Form, Input, Upload, message } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { settingGet, settingUpdate } from "@Api/set_base.js";
import { getPlatformData } from "@Store/features/platformSlice";
import { useDispatch } from "react-redux";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    message.error("图片最大不能超过5MB!");
  }
  return isJpgOrPng && isLt2M;
};

function SetBase() {
  let dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [form] = Form.useForm();

  useEffect(() => {
    getPageData();
  }, []);
  const getPageData = async () => {
    let { data } = await settingGet();
    form.setFieldsValue(data);
    setImageUrl(data.header_logo);
  };

  const onFinish = async (values) => {
    values.header_logo = imageUrl;
    let { success, message: msg } = await settingUpdate(values);
    if (success) {
      message.success(msg);
      await dispatch(getPlatformData());
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

  return (
    <div className="content-wrap">
      <Lbreadcrumb data={["系统设置", "基础设置"]} />
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
        autoComplete="off"
        colon={false}
      >
        <Form.Item
          label="单位名称"
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
          label="单位简称"
          name="company_name_simple"
          rules={[
            {
              required: true,
              message: "请输入",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <h2 className="second-title">系统信息</h2>
        <Form.Item
          label="系统名称"
          name="header_name"
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
          label="展示系统名称"
          name="show_system_name"
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
          // name="header_logo"
          label="logo"
          extra="文件大小不超过1M,图片高度为28px时展示效果最佳"
        >
          <Space>
            <Form.Item noStyle>
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                action="/api/upload/picture"
              >
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{ width: "100%" }}
                    />
                  </>
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
            {imageUrl ? (
              <span className="ant-form-text">
                <Button type="link" danger onClick={deleteLogo}>
                  删除
                </Button>
              </span>
            ) : null}
          </Space>
        </Form.Item>
        <Form.Item label="页脚信息" name="footer_message">
          <Input />
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
  );
}

export default SetBase;
