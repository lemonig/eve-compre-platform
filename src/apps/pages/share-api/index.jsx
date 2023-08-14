import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Button,
  Space,
  Table,
  Form,
  message,
  Typography,
} from "antd";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import {
  shareDoc,
  generateToken,
  stationDataShare,
  factorDataShare,
} from "@Api/input_share.js";
import { inputTrim } from "@Utils/util";
import "./index.less";
import Prism from "prismjs";
import "prismjs/components/prism-javascript"; // 导入 JavaScript 语言扩展
import ReactJson from "react-json-view";

const { Title } = Typography;
const useCopyToClipboard = () => {
  const [isCopied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => setCopied(true))
        .catch((error) => console.error("Copy failed:", error));
    } else {
      // Fallback for browsers that do not support Clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
    }
  };

  return { isCopied, copyToClipboard };
};

function ShareApi() {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  useEffect(() => {
    // 执行代码高亮
    Prism.manual = true;
    Prism.highlightAll();

    // 清理工作，防止内存泄漏
    return () => {
      Prism.highlightAll();
    };
  }, []);
  useEffect(() => {
    getToken(false);
    getPageData();
    getPageData1();
    getPageData2();
  }, []);

  const getPageData = async () => {
    setLoading(true);
    let { data } = await shareDoc();
    setData(data);
    setLoading(false);
  };
  const getPageData1 = async () => {
    setLoading(true);
    let { data } = await stationDataShare();
    // setData(data);
    setData1(data);
  };
  const getPageData2 = async () => {
    setLoading(true);
    let { data } = await factorDataShare();
    // setData(data);
    setData2(data);
  };

  const getToken = async (isRefresh) => {
    const {
      data: { access_token },
    } = await generateToken({ isRefresh });
    setToken(access_token || "");
  };

  const copyToken = async () => {
    copyToClipboard(token);
    message.success("复制成功");
  };

  let inputwidtg = {
    width: "300px",
  };

  return (
    <>
      {data.description && (
        <div className="content-wrap">
          <Lbreadcrumb data={["数据共享", "数据接口"]} />
          <div className="api_warp">
            <Title level={2} style={{ textAlign: "center" }}>
              接口文档
            </Title>
            <div className="doc__content">
              <Form
                autoComplete="off"
                labelCol={{
                  span: 4,
                }}
                wrapperCol={{
                  span: 20,
                }}
              >
                <Form.Item
                  label="Api Token"
                  name="name"
                  getValueFromEvent={inputTrim}
                >
                  <Input style={inputwidtg} value={token} disabled />
                  <p style={{ display: "none" }} id="tokenInput">
                    {token}
                  </p>
                </Form.Item>
                <Form.Item
                  wrapperCol={{
                    offset: 4,
                    span: 20,
                  }}
                >
                  <Space>
                    <Button type="default" onClick={() => getToken(true)}>
                      生成token
                    </Button>
                    <Button type="default" onClick={copyToken}>
                      复制
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </div>

          <div className="api_warp" style={{ paddingTop: "0" }}>
            <div className="doc__content">
              <h2 className="title">接口文档</h2>
              <h3>1.接口文档</h3>
              <p>{data.description}</p>
              <h3>2.请求URL</h3>
              <p>{data.baseUrl + data.path}</p>
              <h3>3.请求方式</h3>
              <p>{data.method}</p>
              <h3>4.输入参数</h3>
              <p style={{ margin: "0" }}>Header参数 </p>
              <Table
                dataSource={JSON.parse(data.header)}
                pagination={false}
                size="small"
              >
                <Table.Column title="参数名" dataIndex="name" key="name" />
                <Table.Column
                  title="必选"
                  dataIndex="required"
                  key="required"
                  render={(required) => (required ? "是" : "否")}
                />
                <Table.Column title="类型" dataIndex="type" key="type" />
                <Table.Column
                  title="说明"
                  dataIndex="description"
                  key="description"
                />
              </Table>
              <p style={{ margin: "26px 0 0" }}>Body参数： </p>
              <Table
                dataSource={JSON.parse(data.requestBody)}
                pagination={false}
                size="small"
              >
                <Table.Column title="参数名" dataIndex="name" key="name" />
                <Table.Column
                  title="必选"
                  dataIndex="required"
                  key="required"
                  render={(required) => (required ? "是" : "否")}
                />
                <Table.Column title="类型" dataIndex="type" key="type" />
                <Table.Column
                  title="说明"
                  dataIndex="description"
                  key="description"
                />
              </Table>
              <h3>5.返回参数</h3>
              <Table
                dataSource={JSON.parse(data.responseBody)}
                pagination={false}
                size="small"
              >
                <Table.Column title="参数名" dataIndex="name" key="name" />
                <Table.Column title="类型" dataIndex="type" key="type" />
                <Table.Column
                  title="说明"
                  dataIndex="description"
                  key="description"
                />
              </Table>
              <h3>6.请求示例</h3>
              {/* <pre className="language-js">
                <code>
                  {JSON.stringify(JSON.parse(data.exampleRequest), null, 2)}
                </code>
              </pre> */}

              <ReactJson
                src={JSON.parse(data.exampleRequest)}
                theme="monokai"
              />
              <h3>7.返回示例</h3>
              {/* 
              <pre className="language-javascript line-numbers">
                {data.exampleResponse}
              </pre> */}
              <ReactJson
                src={JSON.parse(data.exampleResponse)}
                theme="monokai"
              />

              <h3>8.附表</h3>
              <p style={{ margin: " 0" }}>附表1 站点编码</p>
              <Table
                dataSource={data1}
                pagination={false}
                size="small"
                scroll={{
                  y: 300,
                }}
              >
                <Table.Column title="站点名称" dataIndex="name" key="name" />
                <Table.Column
                  title="站点类型"
                  dataIndex="stationType"
                  key="stationType"
                />
                <Table.Column title="站点编码" dataIndex="code" key="code" />
                <Table.Column
                  title="经度"
                  dataIndex="latitude"
                  key="latitude"
                />
                <Table.Column
                  title="纬度"
                  dataIndex="longitude"
                  key="longitude"
                />
              </Table>
              <p style={{ margin: "26px 0 0" }}>附表2 因子字段</p>
              <Table
                dataSource={data2}
                pagination={false}
                size="small"
                scroll={{
                  y: 300,
                }}
              >
                <Table.Column title="因子" dataIndex="label" key="label" />
                <Table.Column title="单位" dataIndex="unit" key="unit" />
                <Table.Column title="字段" dataIndex="value" key="value" />
              </Table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ShareApi;
