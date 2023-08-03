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

const columnsf = [
  {
    title: "序号",
    key: "index",
    width: 60,
    dataIndex: "index",

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
    title: "监测因子",
    dataIndex: "factorName",
    key: "factorName",

  },
  {
    title: "应上传数量",
    dataIndex: "totalNum",
    key: "totalNum",

  },
  {
    title: "实际上传数量",
    dataIndex: "countNum",
    key: "countNum",
  },
  {
    title: "因子传输率(%)",
    dataIndex: "rate",
    key: "rate",
  },
  {
    title: "站点平均传输率(%)",
    dataIndex: "avgRate",
    key: "avgRate",
  },
];


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
  const [data1, setData1] = useState([]);

  // 元数据

  const [stationList, setStationList] = useState([]);

  useEffect(() => {
    getPageData();
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);

  useEffect(() => {
    search()
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
      let ndata = data.map((item, idx) => {
        let temp = {
          index: pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
            idx +
            1,
          key: idx,
          ...item,
          ...item.list[0]
        }
        temp.list.shift()
        temp.list.forEach((jtem, jdx) => {
          jtem.key = idx + '-' + jdx
        })
        return temp
      })
      setData(ndata);
    } else {
      setData1(data);
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


  // 查询
  const search = () => {
    if (pageMsg.pagination.current === 1) {
      getPageData();
    } else {
      setPagemsg({
        ...pageMsg,
        pagination: {
          ...pageMsg.pagination,
          current: 1,
        },
      });
    }
  };

  const getStationMetaPage = async () => {
    let { data } = await stationMetaPage();
    setStationList(data);
  };

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



  return (
    <div className="content-wrap">
      <Lbreadcrumb data={["数据接入", "传输率统计"]} />
      <>
        <div className="search">
          <Form
            layout="inline"
            form={searchForm}
            onFinish={search}
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
          !loading && type === 'factor' && <Table
            columns={columnsf}
            dataSource={data}
            loading={loading}
            pagination={pageMsg.pagination}
            onChange={handleTableChange}
            childrenColumnName="list"
            defaultExpandAllRows={true}
            expandIcon={
              ({ expanded, onExpand, record }) =>
                expanded ? (
                  <span onClick={e => onExpand(record, e)} />
                ) : (
                  <span onClick={e => onExpand(record, e)} />
                )
            }
          />
        }
        {
          type === 'station' && <Table
            columns={columnss}
            dataSource={data1}
            loading={loading}
            pagination={pageMsg.pagination}
            onChange={handleTableChange}
          />
        }
      </>
    </div>
  );
}

export default InputStatis;
