import React, { useState, useEffect } from "react";
import {
  Select,
  Button,
  Space,
  Table,
  Form,
  Empty,
  Radio,
  message,
} from "antd";
// com
import Lbreadcrumb from "@Components/Lbreadcrumb";
import LtimePicker from "@Components/LtimePicker";
import { WarningFilled } from "@ant-design/icons";
import WaterLevel from "@Components/WaterLevel";
// api
import { stationPage as stationMetaPage } from "@Api/user.js";
import { regionList } from "@Api/set_region.js";
import {
  compareMeta,
  dataCompare,
  compareExport,
} from "@Api/operate_compare.js";
import { searchMeta } from "@Api/data-list.js";
// util
import StationForm from "./components/StationForm";
import Graph from "./components/Graph";
import { validateQuery } from "@Utils/valid.js";
import dayjs from "dayjs";
import { formatePickTime, formPickTime } from "@Utils/util";

function OperateCompare() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [btnloading, setBtnLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operate, setOperate] = useState(null); //正在操作id

  // 元数据

  const [stationList, setStationList] = useState([]);

  const stationTypeValue = Form.useWatch("stationType", searchForm);
  const [metaData, setMetaData] = useState({
    evaluateIndex: [],
    factor: [],
  });
  const [columns, setColumns] = useState([]);
  const [additionData, setAdditionData] = useState([]);
  const [stationType, setStationType] = useState();
  const [data, setData] = useState([]); //全部数据
  const [nowdata, setNowData] = useState([]); //当前数据表格
  const [dataGraph, setDataGraph] = useState([]); //图表数据
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [stationId, setStationId] = useState([]); //站点
  const [compType, setCompType] = useState("sequence"); //时间类型
  const [chartModal, setChartModal] = useState("2");

  let normalCol = {
    title: "序号",
    key: "index",
    width: 50,
    fixed: true,
    dataIndex: "index",
    // render: (_, record, idx) =>
    //   pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) + idx + 1,
  };

  useEffect(() => {
    // 元数据获取
    getStationMetaPage();
  }, []);

  const getMetaData = async (val) => {
    let values = searchForm.getFieldsValue();
    let param = {
      stationIdList: val,
    };

    let { data, success } = await compareMeta(param);
    if (success) {
      setMetaData(data);
      searchForm.setFieldsValue({
        factor: [data.factor[0]?.value],
        dataSource: data.dataSource[0]?.value,
        time: formPickTime(data.computeDataLevel[0]?.value),
      });
      getPageData(val);
    }
  };

  const getStationMetaPage = async () => {
    let { data } = await stationMetaPage();
    setStationList(data);
    setStationType(data[0]);
    searchForm.setFieldsValue({
      stationType: data[0].id,
    });
    return data;
  };

  const onStationTypeChange = (id) => {
    let findRes = stationList.find((item) => item.id === id);
    setStationType(findRes);
  };

  const getPageData = async (stationIds) => {
    setLoading(true);
    let values = searchForm.getFieldsValue();
    if (!stationIds.length) {
      message.info("请选择站点");
      return;
    }
    if (
      !validateQuery(
        values.time.startTime,
        values.time.endTime,
        values.time.type
      )
    ) {
      return;
    }

    values.beginTime = formatePickTime(values.time.type, values.time.startTime);
    values.endTime = formatePickTime(values.time.type, values.time.endTime);
    values.timeType = values.time.type;
    values.showFieldList = [...values.factor, ...[values.evaluate ?? ""]]
      .filter(Boolean)
      .flat();
    values.stationIdList = stationIds;
    let { additional_data, data, success } = await dataCompare(values);
    if (success) {
      setData(data);
      let nData = handleData(data, compType);
      let graphData = handleGraph(data, compType);
      setDataGraph(graphData);
      setNowData(nData);
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
          // render: (value) => tableRender(value),
          width: 60,
        };
      });
      setColumns([normalCol, ...newCol]);
      setAdditionData([normalCol, ...newCol]);
    }
    setLoading(false);
  };

  const handleData = (data, initCompType) => {
    //转表格数据
    let index = 0;
    let tabled = data[initCompType].map((item, idx) => {
      if (!!item[0].fieldType) {
        index += 1;
        var obj = {
          id: idx,
          index: index,
        };
        item.forEach((jtem) => {
          Reflect.defineProperty(obj, `${jtem.key}`, {
            value: jtem.value,
          });
        });
        return obj;
      } else {
        return null;
      }
    });
    return tabled.filter(Boolean);
  };

  const handleGraph = (data, initCompType) => {
    let graph = data[initCompType].map((item, idx) => {
      var obj = {
        id: idx,
        index: idx + 1,
      };
      item.forEach((jtem) => {
        Reflect.defineProperty(obj, `${jtem.key}`, {
          value: jtem.value,
        });
      });
      return obj;
    });
    return graph;
  };

  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };

  const stationFormCancel = () => {
    setIsModalOpen(false);
  };

  const stationFormOk = (val) => {
    clartPage();
    setStationId(val);
    setIsModalOpen(false);
    setTimeout(() => {
      getMetaData(val);
    }, 0);
  };
  // 清空页面
  const clartPage = () => {
    searchForm.resetFields();
    setData([]);
    setNowData([]);
    setDataGraph([]);
  };

  const onRadioChange = (e) => {
    setCompType(e.target.value);
    let nData = handleData(data, e.target.value);
    let graphData = handleGraph(data, e.target.value);
    setDataGraph(graphData);
    setNowData(nData);
    if (e.target.value === "avg") {
      let filterCol = columns.filter((ele) => ele.key !== "datatime");
      setColumns(filterCol);
    } else {
      setColumns(additionData);
    }
  };
  const handleChange = (value) => {
    setChartModal(value);
  };

  //导出
  const download = async () => {
    setBtnLoading(true);
    let values = searchForm.getFieldsValue();
    values.beginTime = formatePickTime(values.time.type, values.time.startTime);
    values.endTime = formatePickTime(values.time.type, values.time.endTime);
    values.timeType = values.time.type;
    values.showFieldList = [...values.factor, ...[values.evaluate ?? ""]]
      .filter(Boolean)
      .flat();
    values.stationIdList = stationId;
    await compareExport(values, `数据对比`);
    setBtnLoading(false);
  };
  return (
    <div className="content-wrap">
      <Lbreadcrumb data={["当前位置：数据运营", "数据对比"]} />
      <>
        <div className="search">
          {!!stationType && (
            <Form
              name="station"
              form={searchForm}
              onFinish={() => getPageData(stationId)}
              layout="inline"
            >
              <Form.Item label="站点">
                <span className="ant-form-text">
                  已选择{stationId.length}个站点
                </span>
                <Form.Item name="stationIdList" noStyle>
                  <a onClick={() => setIsModalOpen(true)}>选择站点</a>
                </Form.Item>
              </Form.Item>
              <Form.Item label="因子" name="factor">
                <Select
                  style={{ width: 120 }}
                  placeholder="因子"
                  options={metaData?.factor}
                  mode="multiple"
                  maxTagCount="responsive"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="指标" name="evaluate">
                <Select
                  style={{ width: 120 }}
                  placeholder="指标"
                  options={metaData?.evaluateIndex}
                  mode="multiple"
                  maxTagCount="responsive"
                  allowClear
                />
              </Form.Item>

              <Form.Item label="数据类型" name="dataSource">
                <Select
                  style={{ width: 120 }}
                  placeholder="数据来源"
                  options={metaData?.dataSource}
                />
              </Form.Item>
              <Form.Item label="统计方法" name="time">
                <LtimePicker options={metaData?.computeDataLevel} />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          )}
        </div>
        {nowdata.length ? (
          <>
            <div className="search">
              <Radio.Group
                onChange={onRadioChange}
                optionType="button"
                buttonStyle="solid"
                value={compType}
              >
                <Radio.Button value="sequence">时序对比</Radio.Button>
                <Radio.Button value="avg">均值对比</Radio.Button>
              </Radio.Group>
              <Space>
                <span>坐标轴格式:</span>
                <Select
                  style={{ width: 120 }}
                  placeholder="坐标轴格式"
                  onChange={handleChange}
                  value={chartModal}
                  options={[
                    {
                      value: "1",
                      label: "堆叠",
                    },
                    {
                      value: "2",
                      label: "同轴",
                    },
                    {
                      value: "3",
                      label: "多轴",
                    },
                  ]}
                ></Select>
              </Space>
            </div>

            <Graph
              data={dataGraph}
              chartModal={chartModal}
              loading={loading}
              compType={compType}
              originData={data}
            />

            <div className="search">
              <div></div>
              <Button onClick={download} loading={btnloading}>
                导出
              </Button>
            </div>
            <Table
              columns={columns}
              dataSource={nowdata}
              loading={loading}
              rowKey={(record) => record.idx}
              pagination={pageMsg.pagination}
              onChange={handleTableChange}
            ></Table>
          </>
        ) : (
          <div
            style={{
              height: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Empty />
          </div>
        )}
      </>

      {/* 弹出表单 */}
      {isModalOpen && (
        <StationForm
          open={isModalOpen}
          onOK={stationFormOk}
          onCancel={stationFormCancel}
          list={stationId}
        />
      )}
    </div>
  );
}

export default OperateCompare;
