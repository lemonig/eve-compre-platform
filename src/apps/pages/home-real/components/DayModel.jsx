import React, { useState, useEffect, useRef } from "react";
import { Table, Modal, Tooltip } from "antd";
import dayjs from "dayjs";
import { queryStation } from "@Api/data-list.js";
import { formatePickTime } from "@Utils/util";
import WaterLevel from "@Components/WaterLevel";
import { SettingOutlined, WarningFilled } from "@ant-design/icons";

function DayModel({ open, closeModal, station, factor, timeType }) {
  const handleOk = async () => {};
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [otherdata, setOtherData] = useState({
    maxCountList: [],
    minCountList: [],
    avgCountList: [],
  });
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    console.log(station);
    if (!factor.length) {
      return;
    }
    getPageData();
  }, [JSON.stringify(factor)]);

  const getPageData = async () => {
    setLoading(true);

    let params = {
      page: 1,
      size: 99999,
      data: {
        beginTime: formatePickTime(timeType, dayjs().subtract(30, "days")),
        endTime: formatePickTime(timeType, dayjs()),
        timeType: timeType,
        dataSource: "1",
        stationId: station.id,
        showFieldList: factor,
      },
    };

    let { additional_data, data: getdata } = await queryStation(params);
    setLoading(false);
    setOtherData(additional_data);

    let newCol = additional_data.columnList.map((item) => {
      return {
        title: item.label,
        dataIndex: item.key,
        key: item.key,
        render: (value) => tableRender(value),
        width: 60,
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

  return (
    <div>
      <Modal
        title={station.value + "-最近7天"}
        open={open}
        onOk={handleOk}
        onCancel={() => closeModal(false)}
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
