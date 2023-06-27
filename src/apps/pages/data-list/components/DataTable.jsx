import React, { useState, useEffect, useMemo } from "react";
import { Select, Button, Table, Form, Tooltip, Row, Col } from "antd";
import LtimePicker from "@Components/LtimePicker";
import WaterLevel from "@Components/WaterLevel";
import { queryStation, searchMeta, exportStation } from "@Api/data-list.js";
import FiledSelect from "@Components/FiledSelect";
import dayjs from "dayjs";
import { SettingOutlined, WarningFilled } from "@ant-design/icons";
import { getFactor } from "@Api/data-list.js";
import { formatePickTime } from "@Utils/util";

function tableRender(value) {
  if (value.divColor) {
    return <WaterLevel level={value.value} color={value.divColor}></WaterLevel>;
  } else {
    return (
      <>
        {
          <Tooltip title={value.color ? "超标" : ""}>
            <span
              style={
                value.color
                  ? {
                      color: "#F82504",
                      fontWeight: "bold",
                    }
                  : {}
              }
            >
              {value.value}
            </span>
          </Tooltip>
        }
        {value.tips && (
          <Tooltip title={value.tips}>
            <WarningFilled style={{ color: "#F82504" }} />
          </Tooltip>
        )}
      </>
    );
  }
}

function DataTable({ stationMsg, menuMsg, facList, metaData }) {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [data, setData] = useState([]);
  const [otherdata, setOtherData] = useState({
    maxCountList: [],
    minCountList: [],
    avgCountList: [],
  });
  const [columns, setColumns] = useState([]);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  });

  const [visable, setVisable] = useState(false); //因子选择
  const [factorList, setFactorList] = useState([]); //字段选择回调
  // const [facList, setfacList] = useState([]); //因子
  // searchForm.setFieldsValue({
  //   dataSource: metaData.dataSource[0].value,
  //   time: {
  //     startTime: dayjs().subtract(1, "month"),
  //     endTime: dayjs(),
  //     type: metaData.computeDataLevel[0].value,
  //   },
  // });

  useEffect(() => {
    console.log("init");
  }, []);

  //station Change
  useEffect(() => {
    console.log("pageMsg change");
    if (stationMsg.key && factorList.length) {
      getPageData();
    }
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);

  //factorList/menuMsg Change
  // useEffect(() => {
  //   if (stationMsg.key) {
  //     getMetaData();
  //   }
  // }, [JSON.stringify(factorList)]);

  // const getMetaData = async () => {
  //   let { data, success } = await searchMeta({
  //     id: menuMsg.query,
  //   });
  //   if (success) {
  //     setMetaData(data);
  //     searchForm.setFieldsValue({
  //       dataSource: data.dataSource[0].value,
  //       time: {
  //         startTime: dayjs().subtract(1, "month"),
  //         endTime: dayjs(),
  //         type: data.computeDataLevel[0].value,
  //       },
  //     });
  //   }
  // };

  let normalCol = [
    {
      title: "序号",
      key: "index",
      width: 50,
      fixed: true,
      render: (_, record, idx) =>
        pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
        idx +
        1,
    },
  ];
  const getPageData = async ({ initFactor = factorList } = {}) => {
    let values = searchForm.getFieldsValue();
    let valueCopy = JSON.parse(JSON.stringify(values));

    if (!valueCopy.dataSource || !valueCopy.time) {
      return;
    }
    console.log(valueCopy);
    setLoading(true);
    valueCopy.startTime = formatePickTime(
      valueCopy.time.type,
      valueCopy.time.startTime
    );
    valueCopy.endTime = formatePickTime(
      valueCopy.time.type,
      valueCopy.time.endTime
    );
    let params = {
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        beginTime: valueCopy.startTime,
        endTime: valueCopy.endTime,
        timeType: valueCopy.time.type,
        dataSource: valueCopy.dataSource,
        stationId: stationMsg.key,
        showFieldList: initFactor,
      },
    };
    console.log(params);
    let { additional_data, data: getdata } = await queryStation(params);
    setLoading(false);
    setOtherData(additional_data);
    if (pageMsg.total !== additional_data.pagination.total) {
      setPagemsg({
        ...pageMsg,
        pagination: {
          ...pageMsg.pagination,
          total: additional_data.pagination.total,
        },
      });
    }

    let newCol = additional_data.columnList.map((item) => {
      return {
        title: (
          <p>
            <p>{item.label}</p>
            <p>{item.unit ? `(${item.unit})` : ""}</p>
          </p>
        ),
        dataIndex: item.key,
        key: item.key,
        render: (value) => tableRender(value),
        width: 100,
        ellipsis: true,
        // align: "center",
        fixed:
          item.key === "datatime" ||
          item.key === "station_type" ||
          item.key === "name"
            ? true
            : false,
      };
    });

    setColumns(newCol);
    getdata.forEach((item, idx) => {
      item.key = pageMsg.pagination.current + "-" + idx;
      item.index =
        pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
        idx +
        1;
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
      ...pageMsg,
      pagination: {
        ...pagination,
      },
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
    console.log("callback", data);
    setVisable(false);
    setFactorList(data);
    getPageData({ initFactor: data });
  };

  //导出
  const download = async () => {
    let values = searchForm.getFieldsValue();
    setBtnLoading(true);
    values.startTime = formatePickTime(values.time.type, values.time.startTime);
    values.endTime = formatePickTime(values.time.type, values.time.endTime);

    let params = {
      beginTime: values.startTime,
      endTime: values.endTime,
      timeType: values.time.type,
      dataSource: values.dataSource,
      stationId: stationMsg.key,
      showFieldList: factorList,
    };
    await exportStation(params, `站点数据-${stationMsg.title}`);
    setBtnLoading(false);
  };

  const components = {
    row: (props) => {
      const { children, index } = props;
      const rowData = otherdata?.limitList ? otherdata?.limitList : data[index];
      return <tr {...props}>{children(rowData)}</tr>;
    },
  };

  const memoFiledSelect = useMemo(() => {
    return (
      metaData?.stationField.length &&
      facList.length && (
        <FiledSelect
          title={["站点属性", "评价因子", "监测因子"]}
          options1={metaData?.stationField}
          options2={metaData?.evaluateIndex}
          options3={facList}
          stationId={stationMsg.key}
          open={visable}
          closeModal={() => setVisable(false)}
          onOk={confirmModal}
        />
      )
    );
  }, [visable, facList, metaData]);

  return (
    <>
      <div>
        <div className="search">
          <Form
            layout="inline"
            form={searchForm}
            onFinish={search}
            initialValues={{
              dataSource: metaData.dataSource[0].value,
              time: {
                startTime: dayjs().subtract(1, "month"),
                endTime: dayjs(),
                type: metaData.computeDataLevel[0].value,
              },
            }}
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
              <Button onClick={download} loading={btnLoading}>
                导出
              </Button>
            </Form.Item>
          </Form>
          <SettingOutlined
            onClick={() => setVisable(true)}
            style={{ fontSize: "18px" }}
          />
        </div>
        <Table
          columns={[...normalCol, ...columns]}
          dataSource={data}
          loading={loading}
          rowKey={(record) => record.key}
          pagination={{
            ...pageMsg.pagination,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
          size="small"
          scroll={{
            x: "max-content",
            y: 500,
          }}
          components={components}
          summary={() => (
            <Table.Summary fixed={"bottom"}>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} />
                {otherdata?.maxCountList &&
                  otherdata?.maxCountList.map((item, idx) => {
                    return (
                      <Table.Summary.Cell
                        index={idx + 1}
                        key={idx}
                        style={{ textAlign: "center" }}
                      >
                        {item}
                      </Table.Summary.Cell>
                    );
                  })}
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} />
                {otherdata?.minCountList.map((item, idx) => {
                  return (
                    <Table.Summary.Cell index={idx + 1} key={idx}>
                      {item}
                    </Table.Summary.Cell>
                  );
                })}
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} />
                {otherdata?.avgCountList.map((item, idx) => {
                  return (
                    <Table.Summary.Cell index={idx + 1} key={idx}>
                      {item}
                    </Table.Summary.Cell>
                  );
                })}
              </Table.Summary.Row>
            </Table.Summary>
          )}
          onRow={(record) => {
            // console.log(record);
          }}
        >
          {/* <Table.Summary>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>总计：</Table.Summary.Cell>
              <Table.Summary.Cell index={1}>1</Table.Summary.Cell>
              <Table.Summary.Cell index={2}>{2}</Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary> */}
        </Table>
      </div>
      {memoFiledSelect}
    </>
  );
}

export default DataTable;
