import React, { useState, useEffect, useMemo, useLayoutEffect } from "react";
import { Select, Button, Table, Form, Tooltip } from "antd";
import LtimePicker from "@Components/LtimePicker";
import WaterLevel from "@Components/WaterLevel";
import { queryStation, exportStation } from "@Api/data-list.js";
import FiledSelect from "@Components/FiledSelect";
import { SettingOutlined, WarningFilled } from "@ant-design/icons";
import { formatePickTime, formPickTime } from "@Utils/util";
import { validateQuery } from "@Utils/valid.js";
import { throttle } from "@Utils/util";

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

  //页码变化
  useEffect(() => {
    if (stationMsg.key && factorList.length) {
      getPageData();
    }
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);

  //站点变化->因子变化->表单数据清空
  useLayoutEffect(() => {
    searchForm.setFieldsValue({
      dataSource: metaData.dataSource[0].value,
      time: formPickTime(metaData.computeDataLevel[0].value),
    });
  }, [facList])


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
    // setLoading(true);

    let values = searchForm.getFieldsValue();
    if (
      !validateQuery(
        values.time.startTime,
        values.time.endTime,
        values.time.type
      )
    ) {
      return;
    }
    setLoading(true);
    // let values = JSON.parse(JSON.stringify(values));
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
        showFieldList: initFactor,
      },
    };
    let { additional_data, data: getdata } = await queryStation(params);
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

    getdata.forEach((item, idx) => {
      item.key = pageMsg.pagination.current + "-" + idx;
    });
    setColumns(newCol);
    setData(getdata);
    setLoading(false);
    setOtherData(additional_data);
    //解决第一次请求两次的问题
    if (pageMsg.pagination.total !== additional_data.pagination.total) {
      setPagemsg({
        ...pageMsg,
        pagination: {
          ...pageMsg.pagination,
          total: additional_data.pagination.total,
        },
      });
    }
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

  const throttleTableChange = throttle(handleTableChange, 300);

  const closeModal = (flag) => {
    setVisable(false);
  };

  const confirmModal = (data) => {
    setVisable(false);
    setFactorList(data);
    getPageData({ initFactor: data });
  };

  //导出
  const download = async () => {
    let values = searchForm.getFieldsValue();
    if (
      !validateQuery(
        values.time.startTime,
        values.time.endTime,
        values.time.type
      )
    ) {
      return;
    }
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
    try {
      await exportStation(params, `站点数据-${stationMsg.title}`)
    } catch (error) {

    }

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
            initialValues={{
              dataSource: metaData.dataSource[0].value,
              time: formPickTime(metaData.computeDataLevel[0].value),
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
          onChange={throttleTableChange}
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
      {
        facList.length &&
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
      }
    </>
  );
}

export default DataTable;
