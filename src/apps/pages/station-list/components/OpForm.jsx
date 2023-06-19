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
  PageHeader,
  DatePicker,
  Checkbox,
  Col,
  Row,
  Cascader,
  TreeSelect,
} from "antd";
import IconFont from "@Components/IconFont";
import PageHead from "@Components/PageHead";
import MetaSelect from "@Shared/MetaSelect";
import Map from "./Map";
import dayjs from "dayjs";

import {
  stationAdd,
  stationUpdate,
  stationPage,
  stationGet,
} from "@Api/set_station.js";
import {
  fieldUpdate,
  fieldList as fieldListApi,
  fieldDelete,
} from "@Api/set_meta_field.js";
import { inputTrim } from "@Utils/util";
import { geBaseFields } from "./field";
import { metaBatchList } from "@Api/util.js";
import { topicList } from "@Api/set_meta_theme.js";
import { evaluteList } from "@Api/set_meta_evalute.js";
import { metadataTypePage } from "@Api/set_meta_data.js";
import {
  stationPage as stationMetaPage,
  stationGet as stationMetaGet,
} from "@Api/set_meta_station.js";
import { riverList, riverTree } from "@Api/set_rival.js";
import { regionList, regionTree } from "@Api/set_region.js";
import { templateList } from "@Api/set_factor_template.js";
import { drinkWaterSourcelist } from "@Api/set_msg_drink.js";
import { waterZonelist } from "@Api/set_msg_river_area.js";
import { airZonelist } from "@Api/set_msg_air_area.js";
import { companylist } from "@Api/set_msg_company.js";

function OpForm({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [stationType, setStationType] = useState([]);
  const [stationTypes, setStationTypes] = useState();
  const [fieldList, setFieldList] = useState([]);
  const [stationField, setStationField] = useState([]);
  // 元数据
  const [formField, setFormField] = useState([]);
  const [originOptions, setOriginOptions] = useState([]);
  const [riverOptions, setRiverOptions] = useState([]);
  const [reginList, setReginList] = useState([]);

  const [showMapVis, setShowMapVis] = useState(false);

  useEffect(() => {
    getStationTpeData();
    getfieldList();
    getFormFeild();
  }, []);

  useEffect(() => {
    if (stationTypes) {
      getStationTypeDetail(stationTypes);
    }
  }, [stationTypes]);

  const getStationTpeData = async () => {
    let { data } = await stationMetaPage();
    setStationType(data);
  };

  const getStationTypeDetail = async (value) => {
    let { data } = await stationMetaGet({
      id: value,
    });
    let res = fieldList
      .filter((ele) => data.stationField.includes(ele.id) || ele.isCommon)
      .map((item) => item.code);
    setStationField(res);
    setStationTypes(value);
  };

  const getfieldList = async () => {
    let { data } = await fieldListApi();
    setFieldList(data);
  };

  /*****表格数据****/
  const getFormFeild = async () => {
    const getRiverPage = async () => {
      let { data } = await riverTree();

      setRiverOptions(data);
    };
    const getOriginPage = async () => {
      let { data } = await regionTree();

      setOriginOptions(data);
    };
    //0
    const getTopicList = async () => {
      let { data } = await topicList();
      return data;
    };

    //1
    const getTemplateList = async () => {
      let { data } = await templateList();
      return data;
    };
    //2 饮用水
    const getdrinkWaterSourcelist = async () => {
      let { data } = await drinkWaterSourcelist();
      return data;
    };
    //3 水环境功能去
    const getwaterZonelist = async () => {
      let { data } = await waterZonelist();
      return data;
    };
    //4 大气环境功能去
    const getairZonelist = async () => {
      let { data } = await airZonelist();
      return data;
    };
    //5. 公司
    const getcompanylist = async () => {
      let { data } = await companylist();
      return data;
    };

    getRiverPage();
    getOriginPage();

    Promise.all([
      getTopicList(),
      getTemplateList(),
      getdrinkWaterSourcelist(),
      getwaterZonelist(),
      getairZonelist(),
      getcompanylist(),
    ]).then((res) => {
      setFormField(res);
      setTimeout(() => {
        if (!!record) {
          getDetail();
        } else {
          // getStationTypeDetail(stationType[0].id);
        }
      });
    });
  };

  const getDetail = async () => {
    let { data } = await stationGet({
      id: record.id,
    });

    data.build_date = dayjs(data.build_date);
    form.setFieldsValue(data);
    setStationTypes(data.station_type);
    get_station_connect_upper_region_code(data.station_connect_type_code);
    // setTimeout(() => {
    //   getStationTypeDetail(data.station_type);
    // }, 0);
  };

  /*******地图*******/
  const getPosition = () => {
    setShowMapVis(true);
  };

  //地图回调
  const closeMapModal = (flag) => {
    setShowMapVis(false);
    // if (flag) ();
  };
  const mapConfirm = (value) => {
    form.setFieldsValue({
      longitude: value.lng,
      latitude: value.lat,
    });
    setShowMapVis(false);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onFinish = async () => {
    // form.validateFields();
    let res = await form.validateFields();
    const values = form.getFieldsValue();

    if (values.build_date) {
      values.build_date = dayjs(values.build_date).format("YYYY-MM-DD");
    }
    values.station_type = stationTypes;
    setLoading(true);
    // 编辑
    if (record?.id) {
      values.id = record.id;
      let { success, message: msg } = await stationUpdate(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      } else {
        // message.error(msg);
      }
    } else {
      let { success, message: msg } = await stationAdd(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      } else {
        // message.error(msg);
      }
    }
    // 添加
    setLoading(false);
  };
  // 元数据获取
  const station_connect_type_code_change = (val) => {
    get_station_connect_upper_region_code(val);
  };

  const get_station_connect_upper_region_code = async (regin) => {
    if (regin) {
      let { data } = await regionList({
        level: regin,
      });
      setReginList(data);
    } else {
      form.setFieldsValue({
        station_connect_upper_region_code: "",
        station_connect_lower_region_code: "",
      });
    }
  };

  let inputwidtg = {
    width: "300px",
  };
  const filterElement = (name) => ({
    display: stationField.find((ele) => ele === name) ? "block" : "none",
  });

  const filterRequire = (name) => stationField.find((ele) => ele === name);

  const treeDropdownRender = (data) => {
    const data1 = data.map((item) => {
      if (item.children && item.children.length) {
        item.selectable = false;
        treeDropdownRender(item.children);
      }
      return item;
    });
    return data1;
  };

  return (
    <>
      <PageHead
        title={`${record ? "编辑" : "新建"}站点`}
        onClick={() => closeModal(false)}
      />

      <div className="search">
        <div>
          <span style={{ marginRight: "16px" }}>
            <i className="prompt">*</i> 站点类型
          </span>
          <Select
            className="width-3"
            options={stationType}
            placeholder="请选择"
            fieldNames={{
              label: "name",
              value: "id",
            }}
            onChange={getStationTypeDetail}
            value={stationTypes}
            disabled={!!record}
          />
        </div>
      </div>

      {open && stationField.length > 0 && (
        <Form
          name="basic"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          autoComplete="off"
          form={form}
          colon={false}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            build_date: dayjs(),
          }}
        >
          <h2 className="second-title">基本信息</h2>
          <Row>
            {/* <Col span={12} style={filterElement("topic_type")}>
              <Form.Item
                label="业务主题"
                name="topic_type"
                rules={[
                  {
                    required: true,
                    message: "请输入",
                  },
                ]}
              >
                <Select
                  className="width-3"
                  placeholder="请选择"
                  fieldNames={{
                    label: "name",
                    value: "id",
                  }}
                  options={formField[0]}
                  style={inputwidtg}
                />
              </Form.Item>
            </Col>

            <Col span={12} style={filterElement("station_type")}>
              <Form.Item
                label="站点类型"
                name="station_type"
                rules={[
                  {
                    required: true,
                    message: "请输入",
                  },
                ]}
              >
                <Select
                  className="width-3"
                  placeholder="请选择"
                  fieldNames={{
                    label: "name",
                    value: "id",
                  }}
                  allowClear
                  options={stationType}
                  style={inputwidtg}
                />
              </Form.Item>
            </Col> */}
            <Col span={12} style={filterElement("name")}>
              <Form.Item
                label="站点名称"
                name="name"
                rules={[
                  {
                    required: filterRequire("name"),
                    message: "请输入",
                  },
                ]}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("code")}>
              <Form.Item
                label="站点编码"
                name="code"
                rules={[
                  {
                    required: filterRequire("code"),
                    message: "请输入",
                  },
                ]}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("status")}>
              <Form.Item
                label="运行状态"
                name="status"
                rules={[
                  {
                    required: filterRequire("status"),
                    message: "请输入",
                  },
                ]}
              >
                <MetaSelect dictType="station_status" />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("monitoring_means")}>
              <Form.Item label="监测手段" name="monitoring_means">
                <MetaSelect dictType="monitoring_means" />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("control_level")}>
              <Form.Item
                label="管控级别"
                name="control_level"
                rules={[
                  {
                    required: filterRequire("control_level"),
                    message: "请输入",
                  },
                ]}
              >
                <MetaSelect dictType="control_level" />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("build_date")}>
              <Form.Item label="建站日期" name="build_date">
                <DatePicker format="YYYY/MM/DD" />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("build_factory")}>
              <Form.Item label="建设厂家" name="build_factory">
                <MetaSelect dictType="build_factory" />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("operation_factory")}>
              <Form.Item label="运维厂家" name="operation_factory">
                <MetaSelect dictType="operation_factory" />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("affiliated_company")}>
              <Form.Item label="资产单位" name="affiliated_company">
                <MetaSelect dictType="affiliated_company" />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("exceeded_contact")}>
              <Form.Item label="超标联系人" name="exceeded_contact">
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("exceeded_call")}>
              <Form.Item label="超标联系电话" name="exceeded_call">
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={12} style={filterElement("operation_contact")}>
              <Form.Item label="运维联系人" name="operation_contact">
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("operation_call")}>
              <Form.Item label="运维联系电话" name="operation_call">
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={12} style={filterElement("dust_type_code")}>
              <Form.Item label="扬尘类型" name="dust_type_code">
                <MetaSelect dictType="dust_type" />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("patrol_car_number")}>
              <Form.Item label="走航车牌号" name="patrol_car_number">
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("patrol_car_brand")}>
              <Form.Item label="走航车品牌" name="patrol_car_brand">
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("patrol_device_name")}>
              <Form.Item label="走航设备名称" name="patrol_device_name">
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("patrol_device_code")}>
              <Form.Item label="走航设备编码" name="patrol_device_code">
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <h2 className="second-title">站点位置</h2>
          <Row>
            <Col span={12} style={filterElement("region_code_4")}>
              <Form.Item
                label="区域"
                name="region_code_4"
                rules={[
                  {
                    required: filterRequire("region_code_4"),
                    message: "请输入",
                  },
                ]}
              >
                <TreeSelect
                  treeData={treeDropdownRender(originOptions)}
                  fieldNames={{
                    label: "label",
                    value: "id",
                  }}
                  style={inputwidtg}
                  // dropdownRender={treeDropdownRender}
                />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("river_code_3")}>
              <Form.Item
                label="河流"
                name="river_code_3"
                rules={[
                  {
                    required: filterRequire("river_code_3"),
                    message: "请输入",
                  },
                ]}
              >
                <TreeSelect
                  treeData={treeDropdownRender(riverOptions)}
                  fieldNames={{
                    label: "label",
                    value: "id",
                  }}
                  style={inputwidtg}
                />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("longitude")}>
              <Form.Item
                label="经度"
                name="longitude"
                rules={[
                  {
                    required: true,
                    message: "请输入",
                  },
                ]}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("latitude")}>
              <Form.Item
                label="纬度"
                rules={[
                  {
                    required: true,
                    message: "请输入",
                  },
                ]}
              >
                <Space>
                  <Form.Item
                    name="latitude"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "请输入",
                      },
                    ]}
                  >
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Button onClick={getPosition}>地图选址</Button>
                </Space>
              </Form.Item>
            </Col>

            <Col span={12} style={filterElement("drink_water_source_code")}>
              <Form.Item
                label="饮用水源地"
                name="drink_water_source_code"
                // rules={[
                //   {
                //     required: true,
                //     message: "请输入",
                //   },
                // ]}
              >
                <Select
                  className="width-3"
                  placeholder="请选择"
                  fieldNames={{
                    label: "name",
                    value: "id",
                  }}
                  allowClear
                  options={formField[2]}
                  style={inputwidtg}
                />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("function_zone_water_code")}>
              <Form.Item
                label="地表水环境功能区"
                name="function_zone_water_code"
                // rules={[
                //   {
                //     required: true,
                //     message: "请输入",
                //   },
                // ]}
              >
                <Select
                  className="width-3"
                  placeholder="请选择"
                  fieldNames={{
                    label: "name",
                    value: "id",
                  }}
                  allowClear
                  options={formField[3]}
                  style={inputwidtg}
                />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("function_zone_air_code")}>
              <Form.Item
                label="空气质量功能区"
                name="function_zone_air_code"
                // rules={[
                //   {
                //     required: true,
                //     message: "请输入",
                //   },
                // ]}
              >
                <Select
                  className="width-3"
                  placeholder="请选择"
                  fieldNames={{
                    label: "name",
                    value: "id",
                  }}
                  allowClear
                  options={formField[4]}
                  style={inputwidtg}
                />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("pollution_company_code")}>
              <Form.Item
                label="所属企业"
                name="pollution_company_code"
                // rules={[
                //   {
                //     required: true,
                //     message: "请输入",
                //   },
                // ]}
              >
                <Select
                  className="width-3"
                  placeholder="请选择"
                  fieldNames={{
                    label: "name",
                    value: "id",
                  }}
                  allowClear
                  options={formField[5]}
                  style={inputwidtg}
                />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("order_in_river")}>
              <Form.Item
                label="河流上下游位置"
                name="order_in_river"
                rules={[
                  {
                    required: filterRequire("order_in_river"),
                    message: "请输入",
                  },
                ]}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("is_staion_at_lake")}>
              <Form.Item
                label="是否湖库型站点"
                name="is_staion_at_lake"
                rules={[
                  {
                    required: filterRequire("is_staion_at_lake"),
                    message: "请选择",
                  },
                ]}
              >
                <Select
                  className="width-3"
                  placeholder="请选择"
                  allowClear
                  options={[
                    {
                      label: "是",
                      value: "1",
                    },
                    {
                      label: " 否",
                      value: "0",
                    },
                  ]}
                  style={inputwidtg}
                />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("is_station_connect_section")}>
              <Form.Item
                label="是否交接断面"
                name="is_station_connect_section"
                rules={[
                  {
                    required: filterRequire("is_station_connect_section"),
                    message: "请选择",
                  },
                ]}
              >
                <Select
                  className="width-3"
                  placeholder="请选择"
                  allowClear
                  options={[
                    {
                      label: "是",
                      value: "1",
                    },
                    {
                      label: "否",
                      value: "0",
                    },
                  ]}
                  style={inputwidtg}
                />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("station_connect_type_code")}>
              <Form.Item label="断面跨界类型" name="station_connect_type_code">
                <MetaSelect
                  dictType="station_connect_type"
                  onChange={get_station_connect_upper_region_code}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col
              span={12}
              style={filterElement("station_connect_attribute_code")}
            >
              <Form.Item
                label="断面交接类别"
                name="station_connect_attribute_code"
                // rules={[
                //   {
                //     required: filterRequire("station_connect_attribute_code"),
                //     message: "请输入",
                //   },
                // ]}
              >
                <MetaSelect dictType="station_connect_attribute" />
              </Form.Item>
            </Col>
            <Col
              span={12}
              style={filterElement("station_connect_upper_region_code")}
            >
              <Form.Item
                label="断面交接上游区域"
                name="station_connect_upper_region_code"
              >
                <Select
                  className="width-3"
                  placeholder="请选择"
                  fieldNames={{
                    label: "name",
                    value: "id",
                  }}
                  allowClear
                  options={reginList}
                  style={inputwidtg}
                />
              </Form.Item>
            </Col>
            <Col
              span={12}
              style={filterElement("station_connect_lower_region_code")}
            >
              <Form.Item
                label="断面交接下游区域"
                name="station_connect_lower_region_code"
              >
                <Select
                  className="width-3"
                  placeholder="请选择"
                  fieldNames={{
                    label: "name",
                    value: "id",
                  }}
                  allowClear
                  options={reginList}
                  style={inputwidtg}
                />
              </Form.Item>
            </Col>
          </Row>
          <h2 className="second-title">通讯设置</h2>
          <Row>
            <Col span={12} style={filterElement("password")}>
              <Form.Item label="通讯密码" name="password">
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>

          <h2 className="second-title">站点因子</h2>
          <Row>
            <Col span={12} style={filterElement("factor_template_id")}>
              <Form.Item
                label="因子模板"
                name="factor_template_id"
                rules={[
                  {
                    required: filterRequire("factor_template_id"),
                    message: "请选择",
                  },
                ]}
              >
                <Select
                  className="width-3"
                  placeholder="请选择"
                  fieldNames={{
                    label: "name",
                    value: "id",
                  }}
                  allowClear
                  options={formField[1]}
                  style={inputwidtg}
                />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("target_water_quality_level")}>
              <Form.Item
                label="水质目标类别"
                name="target_water_quality_level"
                rules={[
                  {
                    required: filterRequire("target_water_quality_level"),
                    message: "请输入",
                  },
                ]}
              >
                <MetaSelect dictType="water_quality_level" />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("hour_big_period")}>
              <Form.Item label="大周期小时" name="hour_big_period">
                <MetaSelect
                  dictType="hour_big_period"
                  allowClear
                  mode="multiple"
                  maxTagCount="responsive"
                />
              </Form.Item>
            </Col>
          </Row>
          <h2 className="second-title">其他</h2>
          <Row>
            <Col span={12} style={filterElement("order_num")}>
              <Form.Item
                label="页面顺序"
                name="order_num"
                rules={[
                  {
                    required: true,
                    message: "请输入",
                  },
                ]}
              >
                <Input style={inputwidtg} placeholder="请输入" type="number" />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("remark")}>
              <Form.Item label="备注" name="remark">
                <Input.TextArea className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12} style={filterElement("attachment")}>
              <Form.Item label="附件" name="attachment">
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label=" ">
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
      {/* 地图 */}
      {showMapVis ? (
        <Map
          open={showMapVis}
          closeModal={closeMapModal}
          confirm={mapConfirm}
          value={{
            lat: form.getFieldValue("latitude"),
            lng: form.getFieldValue("longitude"),
          }}
        />
      ) : null}
    </>
  );
}

export default OpForm;
