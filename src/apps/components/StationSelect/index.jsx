import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Button,
  Modal,
  Form,
  message,
  Tooltip,
  PageHeader,
  DatePicker,
  Checkbox,
  Space,
  Switch,
  Table,
  Tag,
  Transfer,
  Row,
  Col,
  Cascader,
} from "antd";
import IconFont from "@Components/IconFont";
import difference from "lodash/difference";
import MetaSelect from "@Shared/MetaSelect";
import { stationPage as stationMetaPage } from "@Api/set_meta_station.js";
import { regionList } from "@Api/set_region.js";
import { riverList } from "@Api/set_rival.js";

const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer {...restProps}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
    }) => {
      console.log(filteredItems);
      const columns = direction === "left" ? leftColumns : rightColumns;
      const rowSelection = {
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter((item) => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };
      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          scroll={{ y: 500 }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              // if (itemDisabled || listDisabled) return;
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
        />
      );
    }}
  </Transfer>
);

const tableColumns = [
  {
    dataIndex: "idx",
    title: "序号",
    width: 50,
  },
  {
    dataIndex: "name",
    title: "站点",
  },
  // {
  //   dataIndex: "regionName",
  //   title: "区域",
  // },
  {
    dataIndex: "stationTypeName",
    title: "站点类型",
  },
];

function StationSelect({ value = [], onChange, options = [] }) {
  const optionsClone = JSON.parse(JSON.stringify(options));
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [targetKeys, setTargetKeys] = useState(value);
  const defaultKey = JSON.parse(JSON.stringify(value));

  // 元数据
  const [originOptions, setOriginOptions] = useState([]);
  const [riverOptions, setRiverOptions] = useState([]);
  const [stationList, setStationList] = useState([]);
  //
  const [data, setData] = useState(options);

  useEffect(() => {
    // 元数据获取

    getOriginPage();
    getRiverPage();
    getStationMetaPage();
  }, []);

  useEffect(() => {
    setData(options);
  }, [options]);

  useEffect(() => {
    console.log(value);
    console.log(options);
    setTargetKeys(value);
  }, [value.length]);

  const getOriginPage = async () => {
    let { data } = await regionList({
      level: "1",
    });
    let newd = data.map((item) => ({
      ...item,
      isLeaf: false,
    }));
    setOriginOptions(newd);
  };
  const getRiverPage = async () => {
    let { data } = await riverList({
      level: "1",
    });
    let newd = data.map((item) => ({
      ...item,
      isLeaf: false,
    }));
    setRiverOptions(newd);
  };

  const getStationMetaPage = async () => {
    let { data } = await stationMetaPage();
    setStationList(data);
  };

  const onTanferChange = (nextTargetKeys) => {
    console.log(nextTargetKeys);
    setTargetKeys(nextTargetKeys);
    onChange(nextTargetKeys);
  };

  // q区域
  const onReginChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };
  const loadeReginData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    let { data } = await regionList({
      parentCode: selectedOptions[selectedOptions.length - 1].code,
    });
    if (selectedOptions[selectedOptions.length - 1].level === 3) {
      targetOption.children = data;
    } else {
      let newd = data.map((item) => ({
        ...item,
        isLeaf: false,
      }));
      targetOption.children = newd;
    }
    setOriginOptions([...originOptions]);
  };

  // 河流
  const onRiverChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };
  const loadRiverData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    let { data } = await riverList({
      parentCode: selectedOptions[selectedOptions.length - 1].code,
    });
    if (selectedOptions[selectedOptions.length - 1].level === 2) {
      targetOption.children = data;
    } else {
      let newd = data.map((item) => ({
        ...item,
        isLeaf: false,
      }));
      targetOption.children = newd;
    }
    setRiverOptions([...riverOptions]);
  };
  // !!value.region ? item.regionName.indexOf(value.region?.join("/")) : true

  const onFormChange = () => {
    let value = searchForm.getFieldsValue();
    console.log(value);
    let res = optionsClone
      .filter(
        (item) => item.stationType === value.stationType || !value.stationType
      )
      .filter((item) => {
        console.log(item.regionName.indexOf(value.region?.join("/")));

        console.log(value.region?.join("/"));
        return !!value.region
          ? item.regionName.indexOf(value.region?.join("/")) === 0
          : true;
      })
      .filter((item) =>
        !!value.river
          ? item?.riverName?.indexOf(value.river?.join("/")) === 0
          : true
      )
      .filter(
        (item) =>
          item.controlLevel === value.controlLevel || !value.controlLevel
      );
    console.log(res);
    //将已选的拿出
    let res1 = optionsClone.filter((ele) => targetKeys.includes(ele.id));
    console.log(res1);
    setData([...new Set([...res, ...res1])]);
  };

  return (
    <>
      <div>
        <Form
          name="station"
          form={searchForm}
          // onFinish={}
          layout="vertical"
        >
          <Row>
            <Col span={6}>
              <Form.Item label="站点类型" name="stationType">
                <Select
                  options={stationList}
                  placeholder="请选择"
                  fieldNames={{
                    label: "name",
                    value: "name",
                  }}
                  allowClear
                  style={{ width: "120px" }}
                  onChange={onFormChange}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="行政区" name="region">
                <Cascader
                  style={{ width: "120px" }}
                  options={originOptions}
                  loadData={loadeReginData}
                  onChange={onFormChange}
                  changeOnSelect
                  fieldNames={{
                    label: "name",
                    value: "name",
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="河流" name="river">
                <Cascader
                  style={{ width: "120px" }}
                  options={riverOptions}
                  loadData={loadRiverData}
                  onChange={onFormChange}
                  changeOnSelect
                  fieldNames={{
                    label: "name",
                    value: "code",
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="管控级别" name="controlLevel">
                <MetaSelect
                  dictType="control_level"
                  style={{ width: "120px" }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <div style={{ clear: "both" }}></div>
      <TableTransfer
        dataSource={data}
        targetKeys={targetKeys}
        showSearch={true}
        onChange={onTanferChange}
        filterOption={(inputValue, item) => {
          console.log(inputValue);
          return (
            item.name.indexOf(inputValue) !== -1 ||
            item.code.indexOf(inputValue) !== -1
          );
        }}
        leftColumns={tableColumns}
        rightColumns={tableColumns}
        operationStyle={{ color: "red" }}
        selectAllLabels={(selectedCount, totalCount) => (
          <span>
            {selectedCount} / {totalCount}项
          </span>
        )}
        titles={["可选站点", "已选站点"].map((item) => (
          <span>{item}</span>
        ))}
      />
    </>
  );
}

export default StationSelect;
