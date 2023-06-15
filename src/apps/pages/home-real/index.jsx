import React, { useEffect, useState, useMemo } from "react";
import {
  Layout,
  Select,
  Space,
  Radio,
  Checkbox,
  Table,
  Tooltip,
  Button,
} from "antd";
import {
  SettingOutlined,
  WarningFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { findMinFrequent, tableIndex } from "@Utils/util";

import LayMenu from "@App/layout/lay-menu";
import TimeCount from "./components/TimeCount";
import { handleMenu } from "@Utils/menu";
import StationTreeMul from "@Shared/stationTreeMul";
import FiledSelect from "@Components/FiledSelect";
import WaterLevel from "@Components/WaterLevel";

import { useDispatch, useSelector } from "react-redux";

import { getFactor } from "@Api/data-list.js";
// import { topicList } from "@Api/set_meta_theme.js";
import { realtimeMeta, dashboardRealtime } from "@Api/operate_time_report.js";
// import { stationPage as stationMetaPage } from "@Api/set_meta_station.js";
import { stationPage as stationMetaPage, topicList } from "@Api/user.js";

import ChartModel from "./components/ChartModel";
import DayModel from "./components/DayModel";

let inputwidtg = {
  width: "120px",
};

function HomeReal() {
  const [stationSelect, setStationSelect] = useState([]);
  const [loading, setLoading] = useState(false);
  //表格
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [otherData, setOtherData] = useState({});

  const [activeKey, setActiveKey] = useState("1");
  const [factList, setFactList] = useState({
    stationField: [],
    evaluateIndex: [],
    factor: [],
  }); //因子

  const [themeList, setThemeList] = useState([]); //业务主题
  const [themeId, setThemeId] = useState("");
  const [stationTypeList, setStationTypeList] = useState([]); //站点类型
  const [stationTypeItem, setStationTypeItem] = useState(); //站点类型
  const [stationTypeIndex, setStationTypeIndex] = useState(0); //站点类型

  const [stationTypeId, setStationTypeId] = useState("");
  const [visable, setVisable] = useState(false); //因子选择
  const [timeType, setTimeType] = useState(); //时间类型

  const [factorList, setFactorList] = useState([]); //字段选择回调

  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);

  const [tableRow, setTableRow] = useState();
  const [tableCell, setTableCell] = useState();

  useEffect(() => {
    initPage();
  }, []);

  useEffect(() => {
    if (stationTypeId && factorList.length) {
      getPageData();
    }
  }, [stationTypeId, factorList, stationSelect, timeType]);

  const getTopicListAsync = async () => {
    let { data } = await topicList();
    return data;
  };

  const getStationTypeAsync = async (id) => {
    let { data } = await stationMetaPage({ topicType: id });
    return data;
  };
  const getRealtimeMetaAsync = async (id) => {
    let { data } = await realtimeMeta({ stationType: id });
    data.factor?.forEach((ele) => (ele.checked = true));
    return data;
  };

  // const sortSelf = (item) => {
  //   console.log(item);
  //   if (typeof item.value === "number" || typeof item.value === "boolean") {
  //     return (a, b) => a[item.key].value - b[item.key].value;
  //   } else if (typeof item.value === "string") {
  //     return (a, b) => a[item.key].value.localeCompare(b[item.key].value);
  //   } else {
  //     return false;
  //   }
  // };
  const sortSelf = (item) => {
    if (item.isDigital) {
      return (a, b) => a[item.key].value - b[item.key].value;
    } else if (item.key === "name") {
      return (a, b) => a[item.key].value.localeCompare(b[item.key].value);
    } else if (item.key === "datatime") {
      return (a, b) =>
        new Date(a[item.key].value) - new Date(b[item.key].value);
    } else {
      return (a, b) => a[item.key].value - b[item.key].value;
    }
  };
  const getPageData = async () => {
    setLoading(true);
    let params = {
      stationType: stationTypeId,
      stationIdList: stationSelect,
      showFieldList: factorList,
      timeType: timeType,
    };
    let { additional_data, data: getdata } = await dashboardRealtime(params);
    setLoading(false);
    setOtherData(additional_data.countData);
    let newCol = additional_data.columnList.map((item) => ({
      title: item.label,
      dataIndex: item.key,
      key: item.key,
      render: (value, record) => tableRender(value, record),
      width: 60,
      ellipsis: true,
      align: "center",
      sorter: {
        compare: sortSelf(item),
      },
      // sorter: sortSelf(item),
    }));
    let normalCol = {
      title: "序号",
      key: "index",
      width: 50,
      dataIndex: "index",
      // render: (_, record, idx) =>
      //   pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
      //   idx +
      //   1,
    };

    newCol.unshift(normalCol);
    setColumns(newCol);
    setData(tableIndex(getdata));
  };

  const refreshPage = () => {
    getPageData();
  };

  const initPage = async () => {
    let res = await getTopicListAsync();
    setThemeList(res);
    setThemeId(res[0].id);
    let res1 = await getStationTypeAsync(res[0].id);
    setStationTypeId(res1[0].id);
    setStationTypeList(res1);
    setStationTypeItem(res1[0]);
    // 数据频次
    let timeTypeDefault = findMinFrequent(res1[0].allComputeDataLevelList);
    setTimeType(timeTypeDefault);
    let res2 = await getRealtimeMetaAsync(res1[0].id);
    setFactList(res2);
  };

  const onStationChange = (e) => {
    setStationSelect(e);
  };

  const onRadioChange = (e) => {
    setTimeType(e.target.value);
  };

  const confirmModal = (data) => {
    console.log("callback", data);
    setVisable(false);
    setFactorList(data);
  };

  //change 业务主题
  const handleTTChange = async (value) => {
    setThemeId(value);
    let res1 = await getStationTypeAsync(value);
    setStationTypeId(res1[0].id);
    setStationTypeList(res1);
    setStationTypeItem(res1[0]);
    let timeTypeDefault = findMinFrequent(res1[0].allComputeDataLevelList);
    setTimeType(timeTypeDefault);
    let res2 = await getRealtimeMetaAsync(res1[0].id);
    setFactList(res2);
  };
  //change 站点类型
  const handleSTChange = (value, option) => {
    console.log(`selected ${option}`);
    setStationTypeId(value);
    setStationTypeItem(option);
  };

  const closeModal = () => {
    setIsDayModalOpen(false);
    setIsChartModalOpen(false);
  };

  const memoStationTree = useMemo(
    () => <StationTreeMul query={stationTypeId} onChange={onStationChange} />,
    [stationTypeId]
  );
  const memoFiledSelect = useMemo(() => {
    return (
      !!factList.factor.length && (
        <FiledSelect
          options1={factList?.stationField}
          options2={factList?.evaluateIndex}
          options3={factList?.factor}
          open={visable}
          closeModal={() => setVisable(false)}
          onOk={confirmModal}
        />
      )
    );
  }, [stationTypeId, visable, factList]);

  const showFactorModel = (value, record) => {
    console.log(value);
    console.log(record);
    if (typeof value.value !== "number") {
      return;
    }
    setTableRow(record.name);
    setTableCell(value);
    setIsChartModalOpen(true);
  };
  const showDayModel = (value, record) => {
    console.log(value);
    console.log(record);
    setTableRow(record.name);
    setTableCell(value);
    setIsDayModalOpen(true);
  };

  const handleNextStationType = () => {
    console.log(stationTypeIndex);
    console.log(stationTypeList);
    if (stationTypeIndex < stationTypeList.length) {
      setStationTypeIndex((i) => i + 1);
      let idx = stationTypeIndex + 1;
      console.log(stationTypeList[idx].id);
      setStationTypeId(stationTypeList[idx].id);
      setStationTypeItem(stationTypeList[idx]);
    }
  };

  function tableRender(value, record) {
    if (value.divColor) {
      return (
        <WaterLevel level={value.value} color={value.divColor}></WaterLevel>
      );
    } else if (value.key === "datatime") {
      return (
        <>{<a onClick={() => showDayModel(value, record)}>{value.value}</a>}</>
      );
    } else if (value.key === "isOnline") {
      if (value.value) {
        return (
          <>
            <CheckCircleOutlined style={{ color: "#4CAF50" }} />
            &nbsp;在线
          </>
        );
      } else {
        return (
          <>
            <CloseCircleOutlined />
            &nbsp;离线
          </>
        );
      }
    } else if (typeof value.value !== "number") {
      return <span>{value.value}</span>;
    } else {
      return (
        <>
          {
            <Tooltip title={value.color ? "超标" : ""}>
              <span
                onClick={() => showFactorModel(value, record)}
                style={
                  value.color
                    ? {
                        color: "#F82504",
                        fontWeight: "bold",
                        cursor:
                          typeof value.value === "number" ? "pointer" : "",
                      }
                    : {
                        cursor:
                          typeof value.value === "number" ? "pointer" : "",
                      }
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

  return (
    <>
      <section className="main-content">
        {/* {!!stationTypeId ? memoStationTree : null} */}
        {memoStationTree}
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
              站点类型：
              <Select
                className="width-3"
                placeholder="请选择"
                fieldNames={{
                  label: "name",
                  value: "id",
                }}
                options={stationTypeList}
                style={inputwidtg}
                value={stationTypeId}
                onChange={handleSTChange}
              />
              <Button type="primary" onClick={refreshPage}>
                刷新
              </Button>
              <Button onClick={handleNextStationType}>下一个</Button>
            </Space>
          </div>
          <div className="search">
            共{otherData.total}个测站，在线{otherData.online}个，离线
            {otherData.offline}个
            <Space>
              {stationTypeItem &&
                stationTypeItem.allComputeDataLevelList.includes("mm") &&
                stationTypeItem.allComputeDataLevelList.includes("hh") && (
                  <Radio.Group
                    onChange={onRadioChange}
                    defaultValue="mm"
                    optionType="button"
                    buttonStyle="solid"
                    value={timeType}
                  >
                    <Radio.Button value="mm">分钟</Radio.Button>
                    <Radio.Button value="hh">小时</Radio.Button>
                  </Radio.Group>
                )}
              <TimeCount callback={refreshPage} />
              <SettingOutlined
                onClick={() => setVisable(true)}
                style={{ fontSize: "18px" }}
              />
            </Space>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey={(record) => record.key}
            size="small"
            pagination={{
              pageSize: 20,
            }}
            scroll={{
              x: true,
              y: 650,
            }}
          ></Table>
        </div>
      </section>
      {memoFiledSelect}
      {/* {!!factList.factor.length && (
        <FiledSelect
          options1={factList?.stationField}
          options2={factList?.evaluateIndex}
          options3={factList?.factor}
          open={visable}
          closeModal={() => setVisable(false)}
          onOk={confirmModal}
        />
      )} */}
      {/* 弹出 */}
      {isDayModalOpen && (
        <DayModel
          open={isDayModalOpen}
          closeModal={closeModal}
          station={tableRow}
          factor={factorList}
          timeType={timeType}
        />
      )}
      {isChartModalOpen && (
        <ChartModel
          open={isChartModalOpen}
          closeModal={closeModal}
          station={tableRow}
          factor={tableCell}
          timeType={timeType}
        />
      )}
    </>
  );
}

export default HomeReal;
