import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  Select,
  Button,
  Space,
  Table,
  DatePicker,
  Form,
  message as msgApi,
  Radio,
} from "antd";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import { inputTrim } from "@Utils/util";
import dayjs from "dayjs";
//api
import { rateStation, rateFactor } from "@Api/input_set.js";
import { stationPage as stationMetaPage } from "@Api/user.js";

import './index.less'

function tableRender(value, record) {
  console.log(value);
  return value.map(item => {
    return <>
      <tr>{item.name}</tr>

    </>
  })
}

function InputStatis() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [type, setType] = useState("factor"); // factor station
  const [data, setData] = useState([]);
  const stytionOptionRef = useRef(null);
  const [columns, setColumns] = useState([]);
  // 元数据

  const [stationList, setStationList] = useState([]);

  useEffect(() => {
    getPageData();
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize, type]);

  useEffect(() => {
    setColumns(type === "station" ? columnss : columnsf);
  }, [type]);

  //
  useEffect(() => {
    getStationMetaPage();
  }, []);

  const getPageData = async () => {
    let values = searchForm.getFieldsValue();

    if (!values.beginTime) {
      msgApi.warning("请选择开始时间");
      return;
    }
    if (!values.endTime) {
      msgApi.warning("请选择结束时间");
      return;
    }
    setLoading(true);
    let params = {
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        ...values,
        beginTime: dayjs(values.beginTime).format("YYYYMMDD"),
        endTime: dayjs(values.endTime).format("YYYYMMDD"),
      },
    };
    const { additional_data, data } =
      type === "station" ? await rateStation(params) : await rateFactor(params);
    if (type !== "station") {
      let res = data
        .map((item, idx) => {
          return item.list.map((jtem, jdx) => {
            if (jdx === 0) {
              let obj = {
                ...item,
                ...jtem,
                sRate: item.rate,
                sNmae: item.name
              };
              delete obj.list;
              return obj;
            } else {
              return jtem;
            }
          });
        })
        .flat();
      console.log(res);
      setData(res);
    } else {
      setData(data);
    }
    setLoading(false);
    setPagemsg({
      ...pageMsg,
      pagination: {
        ...pageMsg.pagination,
        total: additional_data.pagination.total,
      },
    });
  };

  const getStationMetaPage = async () => {
    let { data } = await stationMetaPage();
    setStationList(data);
  };
  const columnsf = [
    {
      title: "序号",
      key: "index",
      width: 60,
      render: (_, record, index) =>
        pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
        index +
        1,
    },
    {
      title: "站点",
      dataIndex: "sNmae",
      key: "name",
    },
    {
      title: "站点类型",
      dataIndex: "typeStationName",
      key: "typeStationName",
    },
    {
      title: "监测因子",
      dataIndex: "name",
      key: "list1",

    },
    // {
    //   title: "应上传数量",
    //   dataIndex: "list",
    //   key: "list2",

    // },
    // {
    //   title: "实际上传数量",
    //   dataIndex: "list",
    //   key: "lis3t",
    // },
    // {
    //   title: "因子传输率(%)",
    //   dataIndex: "list",
    //   key: "lis4t",
    // },
    {
      title: "站点平均传输率(%)",
      dataIndex: "avgRate",
      key: "avgRate",
    },
  ];
  const columnss = [
    {
      title: "序号",
      key: "index",
      width: 60,
      render: (_, record, index) =>
        pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
        index +
        1,
    },
    {
      title: "站点",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "站点类型",
      dataIndex: "typeStationName",
      key: "typeStationName",
    },

    {
      title: "站点平均传输率(%)",
      dataIndex: "rate",
      key: "rate",
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== pageMsg.pagination?.pageSize) {
      setData([]);
    }
  };
  const onTypeChange = (e) => {
    setType(e.target.value);
  };
  let inputwidtg = {
    width: "180px",
  };


  // 自定义表格行的渲染组件
  const CustomRow = (props) => {
    console.log(props);
    const { index, children, ...restProps } = props
    const { record } = children[0].props
    console.log(record);
    console.log(children);
    return <tr style={{ backgroundColor: index % 2 === 0 ? '#000' : 'white' }} {...restProps}>
      {children}
    </tr>
  }
  const CustomCell = ({ children, ...restProps }) => {
    return (
      <td style={{ color: 'red' }} {...restProps}>
        {children}
      </td>
    );
  }


  const components = {
    body: {
      row: CustomRow, // 使用自定义的行渲染组件
      cell: CustomCell
    },
  };

  return (
    <div className="content-wrap">
      <Lbreadcrumb data={["数据共享", "调用日志"]} />

      <>
        <div className="search">
          <Form
            layout="inline"
            form={searchForm}
            onFinish={getPageData}
            autoComplete="off"
            initialValues={{
              beginTime: dayjs().startOf("day").subtract(1, "month"),
              endTime: dayjs().endOf("day"),
            }}
          >
            <Form.Item label="站点类型" name="stationTypeList">
              <Select
                options={stationList}
                placeholder="请选择"
                fieldNames={{
                  label: "name",
                  value: "id",
                }}
                style={{ width: "120px" }}
                allowClear
                mode="multiple"
                maxTagCount="responsive"
              />
            </Form.Item>

            <Form.Item
              style={{
                marginBottom: 0,
              }}
              label="时间"
            >
              <Form.Item
                style={{
                  display: "inline-block",
                }}
                name="beginTime"
                noStyle
              >
                <DatePicker allowClear={false} />
              </Form.Item>
              <span
                style={{
                  display: "inline-block",
                  width: "24px",
                  lineHeight: "32px",
                  textAlign: "center",
                }}
              >
                至
              </span>
              <Form.Item
                label=""
                name="endTime"
                style={{
                  display: "inline-block",
                }}
              >
                <DatePicker allowClear={false} />
              </Form.Item>
            </Form.Item>

            <Form.Item label="" name="name" getValueFromEvent={inputTrim}>
              <Input style={inputwidtg} placeholder="站点名称/站点编码" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </Space>
            </Form.Item>
          </Form>
          <Radio.Group value={type} buttonStyle="solid" onChange={onTypeChange}>
            <Radio.Button value="factor">因子传输率</Radio.Button>
            <Radio.Button value="station">站点传输率</Radio.Button>
          </Radio.Group>
        </div>
        {
          data.length &&
          <Table
            // scroll={{ y: 500 }}
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey={(record) => record.id}
            pagination={{
              ...pageMsg.pagination,

            }}
            onChange={handleTableChange}
            components={components}
          // rowClassName={(record, index) => (index % 2 === 0 ? 'zebra-stripe' : '')}

          />
        }

      </>
    </div>
  );
}

export default InputStatis;
