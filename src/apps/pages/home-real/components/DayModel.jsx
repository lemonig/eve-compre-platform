import React, { useState, useEffect, useRef } from "react";
import { Table, Modal, Tooltip } from "antd";
import dayjs from "dayjs";
import { queryStation } from "@Api/data-list.js";
import { formatePickTime } from "@Utils/util";
import WaterLevel from "@Components/WaterLevel";
import { SettingOutlined, WarningFilled } from "@ant-design/icons";

function DayModel({ open, closeModal, station, factor, timeType, time }) {
  const handleOk = async () => {};
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (!factor.length) {
      return;
    }
    getPageData();
  }, [JSON.stringify(factor)]);

  const getPageData = async () => {
    setLoading(true);

    let params = {
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        beginTime: formatePickTime(timeType, dayjs(time).subtract(7, "days")),
        endTime: formatePickTime(timeType, dayjs(time)),
        timeType: timeType,
        dataSource: "1",
        stationId: station.id,
        showFieldList: factor,
      },
    };

    let { additional_data, data: getdata } = await queryStation(params);
    setLoading(false);
    setOtherData(additional_data);

    if (pageMsg.pagination.total !== additional_data.pagination.total) {
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
            <p>{item.unit}</p>
          </p>
        ),
        dataIndex: item.key,
        key: item.key,
        render: (value) => tableRender(value),
        width: 80,
        // align: "center",
      };
    });

    setColumns(newCol);

    setData(getdata);
  };

  const components = {
    row: (props) => {
      const { children, index } = props;
      const rowData = otherdata?.limitList ? otherdata?.limitList : data[index];
      return <tr {...props}>{children(rowData)}</tr>;
    },
  };

  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };

  return (
    <div>
      <Modal
        title={station.value + "-最近7天"}
        open={open}
        onOk={handleOk}
        onCancel={() => closeModal(false)}
        rowKey={(record) => record.key}
        pagination={pageMsg.pagination}
        onChange={handleTableChange}
        maskClosable={false}
        confirmLoading={loading}
        footer={null}
        width={1200}
      >
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey={(record) => record.key}
          size="small"
          scroll={{
            y: 500,
          }}
          components={components}
          summary={() => (
            <Table.Summary fixed={"bottom"}>
              <Table.Summary.Row>
                {otherdata?.maxCountList &&
                  otherdata?.maxCountList.map((item, idx) => {
                    return (
                      <Table.Summary.Cell
                        style={{ textAlign: "center" }}
                        index={idx}
                        key={idx}
                      >
                        {item}
                      </Table.Summary.Cell>
                    );
                  })}
              </Table.Summary.Row>
              <Table.Summary.Row>
                {otherdata?.minCountList.map((item, idx) => {
                  return (
                    <Table.Summary.Cell index={idx} key={idx}>
                      {item}
                    </Table.Summary.Cell>
                  );
                })}
              </Table.Summary.Row>
              <Table.Summary.Row>
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
          onRow={(record) => {}}
        ></Table>
      </Modal>
    </div>
  );
}

export default DayModel;

function tableRender(value, record) {
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
                      cursor: "pointer",
                    }
                  : { cursor: "pointer" }
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
function titleRender() {}
