import React, { useEffect, useState } from "react";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import {
  Button,
  Space,
  Form,
  Input,
  Checkbox,
  message,
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
import {
  stationPage as stationMetaPage,
  stationGet as stationMetaGet,
} from "@Api/set_meta_station.js";
import { userStation } from "@Api/user.js";
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
    getMetaData(stationId);
  };
  const stationFormCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async () => {
    let values = form.getFieldsValue();
    if (!stationId) {
      message.warning("请选择站点");
      return;
    }
    if (!values.showFieldList2?.length) {
      message.warning("请选择评价指标");
      return;
    }
    if (!values.showFieldList3?.length) {
      message.warning("请选择监测因子");
      return;
    }
    if (!values.timeTypeList) {
      message.warning("请选择统计方法");
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
    console.log(success);
    if (success) {
      setShowHistory(true);
    }

    setLoading(false);
  };
  const closeModal = () => {
    setShowHistory(false);
  };

  return (
    <div className="content-wrap">
      <Lbreadcrumb data={["当前位置：数据运营", "统计报表", "批量导出"]} />
      {!showHistory ? (
        <Form
          name="basic"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          colon={false}
          initialValues={{
            beginTime: dayjs().subtract(1, "month"),
            endTime: dayjs(),
          }}
        >
          <Row>
            <Col span={4} style={{}}>
              <Form.Item label="站点类型" name="stationType">
                <Select
                  className="width-18"
                  options={stationTypeList}
                  placeholder="请选择"
                  fieldNames={{
                    label: "name",
                    value: "id",
                  }}
                  // onChange={getStationTypeDetail}
                />
              </Form.Item>
            </Col>
            {stationTypeValue ? (
              <Col span={12} style={{ marginLeft: "8px" }}>
                <Form.Item name="stationIdList">
                  <span className="ant-form-text">
                    已选择{stationId.length}个站点
                  </span>
                  <Form.Item name="stationIdList" noStyle>
                    <a onClick={() => setIsModalOpen(true)}>选择站点</a>
                  </Form.Item>
                </Form.Item>
              </Col>
            ) : null}
          </Row>
          {stationTypeValue ? (
            <>
              <Form.Item label="站点属性" name="showFieldList1">
                <LcheckBoxGroup
                  options={[...metaData.stationField]}
                  checkAllLabel="全部"
                />
              </Form.Item>
              <Form.Item label="评价指标" name="showFieldList2">
                <LcheckBoxGroup
                  options={metaData.evaluateIndex}
                  checkAllLabel="全部"
                />
              </Form.Item>
              <Form.Item label="监测因子" name="showFieldList3">
                <LcheckBoxGroup
                  options={metaData.factor}
                  checkAllLabel="全部"
                />
              </Form.Item>
              <Form.Item label="数据类型" name="dataSource">
                <Radio.Group options={metaData.dataSource} />
              </Form.Item>
              <Form.Item label="统计方法" name="timeTypeList">
                <Checkbox.Group options={metaData.computeDataLevel} />
              </Form.Item>
              <Row align="middle ">
                <Col style={{}}>
                  <Form.Item label="监测时间" name="beginTime">
                    <DatePicker allowClear={false} />
                  </Form.Item>
                </Col>
                <Col style={{ margin: "0 8px" }}>
                  <Form.Item>至</Form.Item>
                </Col>
                <Col span={8} style={{}}>
                  <Form.Item name="endTime">
                    <DatePicker allowClear={false} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
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
