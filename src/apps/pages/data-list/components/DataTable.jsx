import React, { useState, useEffect } from "react";
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

function DataTable({ stationMsg, menuMsg, facList }) {
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
  const [metaData, setMetaData] = useState({
    computeDataLevel: [],
    dataSource: [],
    stationField: [],
    evaluateIndex: [],
  });
  const [visable, setVisable] = useState(false); //因子选择
  const [factorList, setFactorList] = useState([]); //字段选择回调
  // const [facList, setfacList] = useState([]); //因子

  useEffect(() => {
    console.log("init");
  }, []);

  //menu Change
  useEffect(() => {
    if ((menuMsg.query, stationMsg.key)) {
      console.log("menu - change");
      // setFactorList([]);
      getMetaData();
    }
  }, [menuMsg.query]);

  //station Change
  useEffect(() => {
    if (stationMsg.key) {
      console.log(
        "stationMsg pagination   - change",
        stationMsg,
        pageMsg.pagination
      );
      getPageData();
    }
  }, [stationMsg.key, pageMsg.pagination.current, pageMsg.pagination.pageSize]);

  //factorList/menuMsg Change
  useEffect(() => {
    if (stationMsg.key) {
      console.log("factorList - change");
      getPageData();
    }
  }, [JSON.stringify(factorList)]);

  //pageMsg change
  // useEffect(() => {
  //   if (stationMsg.key) {
  //     getPageData();
  //   }
  // }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);

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
    if (!values.dataSource || !values.time) {
      return;
    }
    setLoading(true);
    values.startTime = formatePickTime(values.time.type, values.time.startTime);
    values.endTime = formatePickTime(values.time.type, values.time.endTime);
    let params = {
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
        title: item.label,
        dataIndex: item.key,
        key: item.key,
        render: (value) => tableRender(value),
        width: 60,
      };
    });
    let normalCol = [
      {
        title: "序号",
        key: "index",
        width: 50,
        dataIndex: "index",
        // render: (_, record, idx) =>
        //   pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
        //   idx +
        //   1,
      },
    ];
    setColumns([...normalCol, ...newCol]);

    getdata.forEach((item, idx) => {
      item.key = pageMsg.pagination.current + "-" + idx;
      item.index =
        pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
        idx +
        1;
    });
    setData([...getdata]);
    // console.log([additional_data.limitList, ...getdata]);
    // setData([additional_data.limitList, ...getdata]);
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
    console.log(pagination);
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
          scroll={{
            x: true,
            y: 500,
          }}
          components={components}
          summary={() => (
            <Table.Summary fixed={"bottom"}>
              <Table.Summary.Row>
                <Table.Summary.Cell />
                {otherdata?.maxCountList &&
                  otherdata?.maxCountList.map((item, idx) => {
                    return (
                      <Table.Summary.Cell index={idx} key={idx}>
                        {item}
                      </Table.Summary.Cell>
                    );
                  })}
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell />
                {otherdata?.minCountList.map((item, idx) => {
                  return (
                    <Table.Summary.Cell index={idx} key={idx}>
                      {item}
                    </Table.Summary.Cell>
                  );
                })}
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell />
                {otherdata?.avgCountList.map((item, idx) => {
                  return (
                    <Table.Summary.Cell index={idx} key={idx}>
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
          // footer={() => {
          //   return (
          //     <tr className="ant-table-row ant-table-row-level-0">
          //       {otherdata?.minCountList &&
          //         otherdata?.minCountList.map((item) => {
          //           return (
          //             <td className="ant-table-cell" key={item}>
          //               {item}
          //             </td>
          //           );
          //         })}
          //     </tr>
          //   );
          // }}
          // rowClassName={(record) => (record.isExternal ? "external-row" : "")}
        >
          <Table.Summary>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>总计：</Table.Summary.Cell>
              <Table.Summary.Cell index={1}>1</Table.Summary.Cell>
              <Table.Summary.Cell index={2}>{2}</Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        </Table>
      </div>
      {metaData?.stationField.length && facList.length ? (
        <FiledSelect
          options1={metaData?.stationField}
          options2={metaData?.evaluateIndex}
          options3={facList}
          stationId={stationMsg.key}
          open={visable}
          closeModal={() => setVisable(false)}
          onOk={confirmModal}
        />
      ) : null}
    </>
  );
}

export default DataTable;
