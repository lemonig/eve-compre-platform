import React, { useEffect, useState, useMemo } from "react";
import { Select, Space, Drawer, Table } from "antd";
import {
  SettingOutlined,
  WarningFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { findMinFrequent, tableIndex } from "@Utils/util";
import Card from "./components/Card";
import List from "./components/List";
// api
import { summary as summaryApi } from "@Api/dashboard.js";
import { topicList } from "@Api/set_meta_theme.js";

let inputwidtg = {
  width: "120px",
};
const allColumns = [
  {
    title: "序号",
    dataIndex: "address",
    width: 80,
    key: "index",
    render: (text, record, index) => index + 1, // 渲染序号
  },
  {
    title: "站点",
    key: "name",
    dataIndex: "name",
  },
];

function HomeView() {
  const [themeList, setThemeList] = useState([]); //业务主题
  const [themeId, setThemeId] = useState();
  const [timeId, setTimeId] = useState("d");
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false); //抽屉
  const [row, setRow] = useState([]); //抽屉数据
  const [columns, setColumns] = useState([]);
  const [drawTitle, setDrawTitle] = useState();

  useEffect(() => {
    const getPageData = async () => {
      let { data } = await summaryApi({
        topicType: themeId,
        timeType: timeId,
      });
      setData(data);
    };
    if (themeId && timeId) {
      getPageData();
    }
  }, [themeId, timeId]);
  useEffect(() => {
    const getPageData = async () => {
      let { data } = await topicList({ existStation: true });
      if (!data.length) {
        return;
      }
      setThemeList([
        {
          name: "全部",
          id: "0",
        },
        ...data,
      ]);
      setThemeId("0");
    };
    getPageData();
  }, []);

  //change 业务主题
  const handleTTChange = async (value) => {
    setThemeId(value);
  };
  const handleTimeChange = async (value) => {
    setTimeId(value);
  };
  const handleShowTable = (index, data, name) => {
    setOpen(true);
    setRow(data);
    let title = "";
    let coloum = [];
    switch (index) {
      case 0:
        coloum = [
          {
            title: "最新上传时间",
            dataIndex: "value",
            key: "time",
          },
          {
            title: "网络状态",
            dataIndex: "value1",
            key: "online",
            sorter: (a, b) => a - b,
            render: (value) =>
              value ? (
                <>
                  <CheckCircleOutlined style={{ color: "#4CAF50" }} />
                  &nbsp;在线
                </>
              ) : (
                <>
                  <CloseCircleOutlined />
                  &nbsp;离线
                </>
              ),
          },
        ];
        title = name + "-站点状态";
        break;
      case 1:
        coloum = [
          {
            title: "离线视频/视频总数",
            dataIndex: "value",
            sorter: (a, b) => a - b,
          },
        ];
        title = name + "-数据传输";
        break;
      case 2:
        coloum = [
          {
            title: "传输率",
            dataIndex: "value",
            sorter: (a, b) => a - b,
          },
        ];
        title = name + "-超标报警";
        break;

      case 3:
        coloum = [
          {
            title: "报警总数",
            dataIndex: "value",
            sorter: (a, b) => a - b,
          },
        ];
        title = name + "-运维报警";
        break;
      case 4:
        coloum = [
          {
            title: "报警总数",
            dataIndex: "value",
            sorter: (a, b) => a - b,
          },
        ];
        title = name + "-站点状态";
        break;
      default:
        break;
    }
    console.log(coloum);
    setColumns(coloum);
    setDrawTitle(title);
  };

  const onClose = () => {
    setOpen(false);
  };
  const data1 = [];
  for (let i = 0; i < 100; i++) {
    data1.push({
      key: i,
      name: `Edward King ${i}`,
      age: 32,
      address: `London, Park Lane no. ${i}`,
    });
  }

  return (
    <div className="content-wrap">
      <div className="search">
        <Space>
          业务主题：
          <Select
            className="width-3"
            placeholder="请选择"
            fieldNames={{
              label: "name",
              value: "id",
            }}
            value={themeId}
            options={themeList}
            style={inputwidtg}
            onChange={handleTTChange}
          />
          统计时间：
          <Select
            className="width-3"
            placeholder="请选择"
            style={inputwidtg}
            value={timeId}
            onChange={handleTimeChange}
            options={[
              {
                label: "今日",
                value: "d",
              },
              {
                label: " 本月",
                value: "m",
              },
              {
                label: " 本年",
                value: "y",
              },
            ]}
          ></Select>
        </Space>
      </div>
      {data.map((item, idx) => {
        return (
          <List title={item.name} key={idx}>
            <Card
              title="站点状态"
              title1="总数"
              title2="离线"
              data={item.data.station}
              onClick={() =>
                handleShowTable(0, item.data.station.list, item.name)
              }
            ></Card>
            <Card
              title="视频状态"
              title1="总数"
              title2="离线"
              data={item.data.camera}
              onClick={() =>
                handleShowTable(1, item.data.camera.list, item.name)
              }
            ></Card>
            <Card
              title="数据传输"
              title1="异常"
              title2=""
              color="rgba(255, 114, 114, 1)"
              data={item.data.transmission}
              onClick={() =>
                handleShowTable(2, item.data.transmission.list, item.name)
              }
            ></Card>
            <Card
              title="超标报警"
              title1="报警站点"
              title2="报警记录"
              color="rgba(255, 114, 114, 1)"
              data={item.data.exceededAlarm}
              onClick={() =>
                handleShowTable(3, item.data.exceededAlarm.list, item.name)
              }
            ></Card>
            <Card
              title="运维报警"
              title1="报警站点"
              title2="报警记录"
              color="rgba(255, 114, 114, 1)"
              data={item.data.operationAlarm}
              onClick={() =>
                handleShowTable(4, item.data.operationAlarm.list, item.name)
              }
            ></Card>
          </List>
        );
      })}
      <Drawer
        width={640}
        title={drawTitle}
        placement="right"
        onClose={onClose}
        open={open}
      >
        <Table
          columns={[...allColumns, ...columns]}
          dataSource={row}
          pagination={false}
          scroll={{
            y: "80vh",
          }}
        />
      </Drawer>
    </div>
  );
}

export default HomeView;
