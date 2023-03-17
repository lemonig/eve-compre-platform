import React, { useState, useEffect } from "react";
import {
  Select,
  Button,
  Table,
  Form,
  Tooltip,
  PageHeader,
  Statistic,
  Modal,
  message,
  Space,
} from "antd";
import LtimePicker from "@Components/LtimePicker";
import WaterLevel from "@Components/WaterLevel";
import { queryStation, searchMeta } from "@Api/data-list.js";
import FiledSelect from "@Components/FiledSelect";
import dayjs from "dayjs";
import { SettingOutlined, WarningFilled } from "@ant-design/icons";
import { getFactor } from "@Api/data-list.js";

const formatePickTime = (type, value) => {
  if (type === "mm") {
    return dayjs(value).format("YYYYMMDDHHmm");
  } else if (type === "hh") {
    return dayjs(value).format("YYYYMMDDHH");
  } else if (type === "d") {
    return dayjs(value).format("YYYYMMDD");
  } else if (type === "w") {
    return dayjs(value).format("YYYYWW");
  } else if (type === "m") {
    return dayjs(value).format("YYYYMM");
  } else if (type === "q") {
    return dayjs(value).format("YYYY0Q");
  } else if (type === "y") {
    return dayjs(value).format("YYYY");
  }
};

function tableRender(value) {
  if (value.divColor) {
    return <WaterLevel level={value.value} color={value.divColor}></WaterLevel>;
  } else if (value.color) {
    return (
      <Tooltip title={"超标"}>
        <span
          style={{
            color: "#F82504",
            fontWeight: "bold",
          }}
        >
          {value.value}
        </span>
      </Tooltip>
    );
  } else if (value.tips) {
    return (
      <>
        <span>{value.value}</span>
        &nbsp;
        <Tooltip title={value.tips}>
          <WarningFilled style={{ color: "#F82504" }} />
        </Tooltip>
      </>
    );
  } else {
    return value.value;
  }
}

function DataTable({ stationMsg, menuMsg }) {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  });
  const [metaData, setMetaData] = useState({
    computeDataLevel: [],
    dataSource: [],
    stationField: [],
    evaluateIndex: [],
  });
  const [visable, setVisable] = useState(false); //因子选择
  const [factorList, setFactorList] = useState([]); //字段选择回调
  const [facList, setfacList] = useState([]); //因子

  useEffect(() => {
    if ((menuMsg.query, stationMsg.key)) {
      getMetaData();
    }
  }, [menuMsg.query, stationMsg.key]);

  useEffect(() => {
    if (stationMsg.key) {
      const getFactorData = async () => {
        let { data } = await getFactor({
          id: stationMsg.key,
        });
        data?.forEach((item) => {
          item.checked = true;
        });
        console.log(data);
        setfacList(data);
      };
      getFactorData();
    }
  }, [stationMsg.key]);

  useEffect(() => {
    if (stationMsg.key) {
      search();
    }
  }, [JSON.stringify(factorList), JSON.stringify(menuMsg)]);
  // useEffect(() => {
  //   if (stationMsg.key) {
  //     getMetaData();
  //   }
  // }, [JSON.stringify(pageMsg)]);

  const getMetaData = async () => {
    let { data, success } = await searchMeta({
      id: menuMsg.query,
    });
    if (success) {
      setMetaData(data);
      searchForm.setFieldsValue({
        dataSource: data.dataSource[0].value,
        time: {
          startTime: dayjs().subtract(1, "month"),
          endTime: dayjs(),
          type: data.computeDataLevel[0].value,
        },
      });
    }
  };

  const getPageData = async () => {
    let values = searchForm.getFieldsValue();
    setLoading(true);
    values.startTime = formatePickTime(values.time.type, values.time.startTime);
    values.endTime = formatePickTime(values.time.type, values.time.endTime);
    let { additional_data, data: getdata } = await queryStation({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        beginTime: values.startTime,
        endTime: values.endTime,
        timeType: values.time.type,
        dataSource: values.dataSource,
        stationId: stationMsg.key,
        showFieldList: factorList,
      },
    });
    setLoading(false);

    setPagemsg({
      ...pageMsg,
      pagination: {
        ...pageMsg.pagination,
        total: additional_data.pagination.total,
      },
    });
    let newCol = additional_data.columnList.map((item) => {
      return {
        title: item.label,
        dataIndex: item.key,
        key: item.key,
        render: (value) => tableRender(value),
      };
    });
    let normalCol = [
      {
        title: "序号",
        key: "index",
        width: 60,
        render: (_, record, index) =>
          pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
          index +
          1,
      },
    ];
    setColumns([...normalCol, ...newCol]);

    getdata.forEach((item, idx) => {
      item.key = pageMsg.pagination.current + "-" + idx;
    });
    setData([...getdata]);
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

  const closeModal = (flag) => {
    setVisable(false);
  };

  const confirmModal = (data) => {
    setVisable(false);
    setFactorList(data);
  };

  return (
    <>
      <div>
        <div className="search">
          <Form
            layout="inline"
            form={searchForm}
            onFinish={search}
            initialValues={{}}
          >
            <Form.Item label="" name="dataSource">
              <Select
                style={{ width: 120 }}
                placeholder="数据来源"
                options={metaData?.dataSource}
              />
            </Form.Item>
            <Form.Item label="" name="time">
              <LtimePicker options={metaData?.computeDataLevel} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Button>导出</Button>
            </Form.Item>
          </Form>
          <SettingOutlined
            onClick={() => setVisable(true)}
            style={{ fontSize: "18px" }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey={(record) => record.key}
          pagination={{
            ...pageMsg.pagination,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
          size="small"
          // scroll={{
          //   y: 500,
          // }}
        />
      </div>
      {metaData?.stationField.length && facList.length ? (
        <FiledSelect
          options1={metaData?.stationField}
          options2={metaData?.evaluateIndex}
          options3={facList}
          open={visable}
          closeModal={() => setVisable(false)}
          onOk={confirmModal}
        />
      ) : null}
    </>
  );
}

export default DataTable;
