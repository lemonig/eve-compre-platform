import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Button,
  Space,
  Table,
  Tag,
  Modal,
  Form,
  message,
  Tooltip,
  Switch,
  Cascader,
  Checkbox,
  Radio,
} from "antd";
// com
import Lbreadcrumb from "@Components/Lbreadcrumb";
import IconFont from "@Components/IconFont";
import dayjs from "dayjs";
import LtimePicker from "@Components/LtimePicker";
import {
  SettingOutlined,
  WarningFilled,
  InfoCircleOutlined,
} from "@ant-design/icons";
import FiledSelect from "@Components/FiledSelect";
import WaterLevel from "@Components/WaterLevel";
// api
import { reportTime, reportTimeMeta } from "@Api/operate_time_report.js";
import { stationPage as stationMetaPage } from "@Api/user.js";
import { regionList } from "@Api/set_region.js";
import { compareMeta, dataCompare } from "@Api/operate_compare.js";
import { searchMeta } from "@Api/data-list.js";
// util
import { formatePickTime } from "@Utils/util";
import StationForm from "./components/StationForm";
import Graph from "./components/Graph";
const { Option } = Select;

const getFormCasData = (data = []) => {
  return data?.map((item) => {
    return item[item.length - 1];
  });
};

function tableRender(value) {
  console.log(value);
  if (!value) {
    return;
  }
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

const pageSize = 10;

const DynamicTableHeader = ({ columns }) => {
  return columns.map((column) => (
    <Table.Column
      title={column.title}
      dataIndex={column.dataIndex}
      key={column.key}
    />
  ));
};

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
  const [stationType, setStationType] = useState();
  const [data, setData] = useState([]); //全部数据
  const [nowdata, setNowData] = useState([]); //当前数据
  const [visable, setVisable] = useState(false); //因子选择
  const [factorList, setFactorList] = useState([]); //字段选择回调
  const [currentPage, setCurrentPage] = useState(1);
  const [stationId, setStationId] = useState([]); //站点

  const [evaluteList, setEvaluteList] = useState([]);
  const [compType, setCompType] = useState("sequence"); //时间类型
  const [chartModal, setChartModal] = useState("2");

  useEffect(() => {
    // 元数据获取
    getStationMetaPage();
  }, []);

  let normalCol = [
    {
      title: "序号",
      key: "index",
      width: 50,
      dataIndex: "index",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
  ];

  const getMetaData = async (val) => {
    let values = searchForm.getFieldsValue();
    console.log(values);
    let param = {
      stationIdList: val,
    };

    let { data, success } = await compareMeta(param);
    if (success) {
      setMetaData(data);
      // searchForm.setFieldsValue({
      //   dataSource: data.dataSource[0].value,
      //   time: {
      //     startTime: dayjs().subtract(1, "month"),
      //     endTime: dayjs(),
      //     type: data.computeDataLevel[0].value,
      //   },
      // });
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

  const getPageData = async () => {
    setLoading(true);
    let values = searchForm.getFieldsValue();
    values.beginTime = formatePickTime(values.time.type, values.time.startTime);
    values.endTime = formatePickTime(values.time.type, values.time.endTime);
    values.timeType = values.time.type;
    values.showFieldList = [...values.factor, ...[values.evaluate ?? ""]]
      .filter(Boolean)
      .flat();
    values.stationIdList = stationId;
    console.log(values);

    let { additional_data, data, success } = await dataCompare(values);
    if (success) {
      setData(data);
      let nData = handleData(data, compType);
      console.log(nData);
      setNowData(nData);
      let newCol = additional_data.columnList.map((item) => ({
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
      }));

      setColumns(newCol);
    }
    setLoading(false);
  };

  const handleData = (data, initCompType) => {
    //转表格数据
    let tabled = data[initCompType].map((item, idx) => {
      let obj = {
        id: idx,
      };
      item.forEach((jtem) => {
        Reflect.defineProperty(obj, `${jtem.key}`, {
          value: jtem.value,
        });
      });
      return obj;
    });
    return tabled;
  };

  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    // `dataSource` is useless since `pageSize` changed
    setCurrentPage(pagination.current);
  };

  const confirmModal = (data) => {
    setVisable(false);
    setFactorList(data);
  };
  const stationFormCancel = () => {
    setIsModalOpen(false);
  };

  const stationFormOk = (val) => {
    setStationId(val);
    setIsModalOpen(false);
    getMetaData(val);
  };

  const onRadioChange = (e) => {
    setCompType(e.target.value);
    let nData = handleData(data, e.target.value);
    console.log(nData);
    setNowData(nData);
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setChartModal(value);
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
              onFinish={getPageData}
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

              {/* <Form.Item label="" name="showFieldList">
                <Select
                  style={{ width: 120 }}
                  options={[...facList, ...evaluteList]}
                  placeholder="请选择"
                />
              </Form.Item> */}

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
                  <Button loading={btnloading}>导出</Button>
                </Space>
              </Form.Item>
            </Form>
          )}
        </div>
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
        {nowdata && (
          <Graph
            data={nowdata}
            chartModal={chartModal}
            loading={loading}
            compType={compType}
            originData={data}
          />
        )}

        {columns.length > 0 && (
          <Table
            columns={[...normalCol, ...columns]}
            dataSource={nowdata}
            loading={loading}
            rowKey={(record) => record.idx}
            onChange={handleTableChange}
            pagination={{ pageSize }}
          ></Table>
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
