import React, { useState, useEffect } from "react";
import { Modal, Checkbox, Col, Row } from "antd";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./index.less";

function FiledSelect({
  value = [],
  onChange,
  stationId,
  open,
  closeModal,
  onOk,
  options1,
  options2,
  options3,
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]); //FIXME因为没有state页面不刷新，故加个

  useEffect(() => {
    options1?.forEach((item) => {
      item.checked = false;
    });
    options2?.forEach((item) => {
      item.checked = false;
    });
  }, []);
  useEffect(() => {
    console.log("options3", options3);
    setData(options3);
    onOk(filterCheck(options3));
  }, [options3.length]);

  useEffect(() => {
    //FIXME组件创建时value还没值，故这里产生第二次更新
  }, [JSON.stringify(value)]);

  const onCheckChange = (item) => {
    if ("checked" in item) {
      item.checked = !item.checked;
    } else {
      item.checked = true;
    }
    setData([...data]);
  };
  function filterCheck(data) {
    return data.filter((ele) => ele.checked).map((item) => item.value);
  }
  const handleOk = async () => {
    setLoading(true);

    let res1 = filterCheck(data);
    let res2 = filterCheck(options1);
    let res3 = filterCheck(options2);
    console.log(res1);
    console.log(res2);
    console.log(res3);
    onOk([...res1, ...res2, ...res3]);
    // 添加
    setLoading(false);
  };

  return (
    <Modal
      title={`设置显示字段`}
      onOk={handleOk}
      onCancel={() => closeModal(false)}
      open={open}
      maskClosable={false}
      width={800}
      confirmLoading={loading}
    >
      <div className="form-factor-content">
        <div>
          <fieldset>
            <legend>站点属性</legend>
            <div style={{ width: "100%" }}>
              <Row
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  overflow: "auto",
                }}
              >
                {options1.map((item, idx) => (
                  <Col
                    span={6}
                    key={item.id + idx}
                    style={{ marginBottom: "10px" }}
                  >
                    <Checkbox
                      checked={item.checked}
                      onChange={() => onCheckChange(item)}
                    >
                      {item.label}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </div>
          </fieldset>
          <fieldset>
            <legend>评价因子</legend>
            <div style={{ width: "100%" }}>
              <Row
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  overflow: "auto",
                }}
              >
                {options2.map((item, idx) => (
                  <Col
                    span={6}
                    key={item.id + idx}
                    style={{ marginBottom: "10px" }}
                  >
                    <Checkbox
                      checked={item.checked}
                      onChange={() => onCheckChange(item)}
                    >
                      {item.label}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </div>
          </fieldset>
          <fieldset>
            <legend>监测因子</legend>
            <div style={{ width: "100%" }}>
              <Row
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  overflow: "auto",
                }}
              >
                {data.map((item, idx) => (
                  <Col
                    span={6}
                    key={item.id + idx}
                    style={{ marginBottom: "10px" }}
                  >
                    <Checkbox
                      checked={item.checked}
                      onChange={() => onCheckChange(item)}
                    >
                      {item.label}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </div>
          </fieldset>
        </div>

        <div>
          <div style={{ marginBottom: "5px" }}>
            <i className="prompt">*</i> 当前选定字段
          </div>
          <div style={{ maxHeight: "390px", overflowY: "auto" }}>
            {data.map((item, idx) =>
              item.checked ? (
                <div className="checkedList" key={item.value + idx}>
                  {item.label}
                  <CloseOutlined onClick={() => onCheckChange(item)} />
                </div>
              ) : null
            )}
            {options1.map((item, idx) =>
              item.checked ? (
                <div className="checkedList" key={item.value + idx}>
                  {item.label}
                  <CloseOutlined onClick={() => onCheckChange(item)} />
                </div>
              ) : null
            )}
            {options2.map((item, idx) =>
              item.checked ? (
                <div className="checkedList" key={item.value + idx}>
                  {item.label}
                  <CloseOutlined onClick={() => onCheckChange(item)} />
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default FiledSelect;
