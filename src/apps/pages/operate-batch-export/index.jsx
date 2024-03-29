import React, { useEffect, useState } from "react";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import {
  Button,
  Space,
  Form,
  Input,
  Checkbox,
  message as msgApi,
  Select,
  Row,
  Col,
  DatePicker,
  Radio,
  notification,
} from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import StationForm from "./components/StationForm";
import { batchExport, batchExportMeta } from "@Api/operate_time_report.js";
import { stationGet as stationMetaGet } from "@Api/set_meta_station.js";
import { userStation, stationPage as stationMetaPage } from "@Api/user.js";
import OperateExportHistory from "../operate-export-history";
import LcheckBoxGroup from "@Components/LcheckBoxGroup";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

function BatchExport() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const stationTypeValue = Form.useWatch("stationType", form);
  const [stationTypeList, setStationTypeList] = useState([]);

  const [stationId, setStationId] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [metaData, setMetaData] = useState({
    stationField: [],
    factor: [],
    evaluateIndex: [],
    dataSource: [],
    computeDataLevel: [],
  });

  const [stationList, setStationList] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [showHistory, setShowHistory] = useState(false);
  const timeTypeListFile = Form.useWatch("timeTypeList", form);
  let navigate = useNavigate();
  //全选

  useEffect(() => {
    getStationTpeData();
  }, []);

  useEffect(() => {
    if (stationTypeValue) {
      form.resetFields([
        "showFieldList1",
        "showFieldList2",
        "showFieldList3",
        "dataSource",
        "timeTypeList",
      ]);
      getStationList(stationTypeValue).then((idList) =>
        getMetaData(idList, stationTypeValue)
      );
    }
  }, [stationTypeValue]);

  useEffect(() => {
    if (timeTypeListFile) {
      if (timeTypeListFile.includes("mm")) {
        form.setFieldsValue({
          beginTime: dayjs().startOf("day").subtract(7, "day"),
          endTime: dayjs().endOf("day"),
        });
      } else {
        form.setFieldsValue({
          beginTime: dayjs().startOf("day").subtract(1, "month"),
          endTime: dayjs().endOf("day"),
        });
      }
    }
  }, [timeTypeListFile]);

  // 获取站点类型
  const getStationTpeData = async () => {
    let { data } = await stationMetaPage();
    setStationTypeList(data);
    // form.setFieldsValue({
    //   stationType: data[0].id,
    // });
    return data[0].id;
    // setStationTypes(data[0].id);
    // setStationId();
  };

  // 获取站点
  const getStationList = async (stationType) => {
    const { data } = await userStation({
      page: 1,
      size: 10000,
    });
    let defaultIds = [];
    let idata = data.map((item, idx) => {
      if (item.stationType == stationType) {
        defaultIds.push(item.id);
      }
      return {
        ...item,
        idx: idx + 1,
        key: item.id,
      };
    });
    setStationList(idata);
    setStationId(defaultIds);
    return defaultIds;
  };
  // 表单选项
  const getMetaData = async (idList, stationType) => {
    let { data, success } = await batchExportMeta({
      stationType: stationTypeValue ?? stationType,
      stationIdList: idList,
    });
    if (success) {
      setMetaData(data);
      form.setFieldsValue({
        dataSource: data.dataSource[0]?.value ?? "",
      });
    }
  };

  const getStationTypeDetail = async (value) => {
    let { data } = await stationMetaGet({
      id: value,
    });

    // let res = fieldList
    //   .filter((ele) => data.stationField.includes(ele.id) || ele.isCommon)
    //   .map((item) => item.code);
    // setStationField(res);
    // setStationTypes(value);
  };

  const stationFormOk = (val) => {
    setStationId(val);
    setIsModalOpen(false);
    getMetaData(val);
  };
  const stationFormCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async () => {
    let values = form.getFieldsValue();
    if (!stationId) {
      msgApi.info("请选择站点");
      return;
    }

    if (!values.showFieldList3?.length) {
      msgApi.warning("请选择监测因子");
      return;
    }
    if (!values.timeTypeList) {
      msgApi.warning("请选择统计方法");
      return;
    }
    if (!values.beginTime) {
      msgApi.warning("请选择开始时间");
      return;
    }
    if (!values.endTime) {
      msgApi.warning("请选择结束时间");
      return;
    }
    setLoading(true);
    let params = {
      beginTime: dayjs(values.beginTime).format("YYYYMMDD"),
      endTime: dayjs(values.endTime).format("YYYYMMDD"),
      showFieldList: [
        ...[values.showFieldList1 ?? ""],
        ...[values.showFieldList2 ?? ""],
        ...[values.showFieldList3 ?? ""],
      ]
        .filter(Boolean)
        .flat(),
      stationIdList: stationId,
      stationType: values.stationType,
      dataSource: values.dataSource,
      timeTypeList: values.timeTypeList,
    };
    let { success, message } = await batchExport(params);
    if (success) {
      setShowHistory(true);
    }

    setLoading(false);
  };
  const closeModal = () => {
    setShowHistory(false);
  };
  const formItemLayout = {
    labelCol: {
      span: 2,
    },
    wrapperCol: {
      span: 14,
    },
  };

  return (
    <div className="content-wrap">
      <Lbreadcrumb data={["当前位置：数据运营", "批量导出"]} />
      {!showHistory ? (
        <Form
          name="basic"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          colon={false}
          {...formItemLayout}
        >
          <Form.Item
            label="站点类型"
            style={{
              marginBottom: "0",
            }}
          >
            <Form.Item
              name="stationType"
              style={{
                display: "inline-block",
                marginBottom: "0",
              }}
            >
              <Select
                className="width-18"
                style={{ width: "180px" }}
                options={stationTypeList}
                placeholder="请选择"
                fieldNames={{
                  label: "name",
                  value: "id",
                }}
                // onChange={getStationTypeDetail}
              />
            </Form.Item>
            <span
              style={{
                display: "inline-block",
                width: "15px",
              }}
            ></span>
            {stationTypeValue ? (
              <Form.Item
                name="stationIdList"
                style={{
                  display: "inline-block",
                }}
              >
                <span className="ant-form-text">
                  已选择{stationId.length}个站点
                </span>
                <Form.Item name="stationIdList" noStyle>
                  <a onClick={() => setIsModalOpen(true)}>选择站点</a>
                </Form.Item>
              </Form.Item>
            ) : null}
          </Form.Item>

          {stationTypeValue ? (
            <>
              <Form.Item
                label="站点属性"
                name="showFieldList1"
                style={{
                  marginBottom: "0",
                }}
              >
                <LcheckBoxGroup
                  options={[...metaData.stationField]}
                  checkAllLabel="全部"
                />
              </Form.Item>
              <Form.Item
                label="评价指标"
                name="showFieldList2"
                style={{
                  marginBottom: "0",
                }}
              >
                <LcheckBoxGroup
                  options={metaData.evaluateIndex}
                  checkAllLabel="全部"
                />
              </Form.Item>
              <Form.Item
                label="监测因子"
                name="showFieldList3"
                required
                style={{
                  marginBottom: "0",
                }}
              >
                <LcheckBoxGroup
                  options={metaData.factor}
                  checkAllLabel="全部"
                />
              </Form.Item>
              <Form.Item label="数据类型" name="dataSource" required>
                <Radio.Group options={metaData.dataSource} />
              </Form.Item>
              <Form.Item label="统计方法" name="timeTypeList" required>
                <Checkbox.Group options={metaData.computeDataLevel} />
              </Form.Item>

              <Form.Item
                style={{
                  marginBottom: 0,
                }}
                label="监测时间"
                required
              >
                <Form.Item
                  style={{
                    display: "inline-block",
                  }}
                  name="beginTime"
                >
                  <DatePicker allowClear={false} />
                </Form.Item>
                <span
                  style={{
                    display: "inline-block",
                    width: "24px",
                    lineHeight: "32px",
                    textAlign: "center",
                  }}
                >
                  至
                </span>
                <Form.Item
                  name="endTime"
                  style={{
                    display: "inline-block",
                  }}
                >
                  <DatePicker allowClear={false} />
                </Form.Item>
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 2,
                }}
              >
                <Button type="primary" htmlType="submit" loading={loading}>
                  导出
                </Button>
              </Form.Item>
            </>
          ) : null}
        </Form>
      ) : (
        <OperateExportHistory isRouter={false} closeModal={closeModal} />
      )}

      {/* 弹出表单 */}
      <StationForm
        open={isModalOpen}
        onOK={stationFormOk}
        onCancel={stationFormCancel}
        list={stationId}
        defaultStationType={stationTypeValue}
        options={stationList}
      />
    </div>
  );
}

export default BatchExport;
