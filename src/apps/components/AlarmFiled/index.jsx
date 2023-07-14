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
import "../FiledSelect/index.less";

function filterCheck(data) {
  return data.filter((ele) => ele.checked).map((item) => item);
}
function filterOption(data) {
  return data.filter((ele) => ele.checked);
}

const text = [
  { label: "报警编号", key: "messageCode" },
  { label: "站点名称", key: "stationName" },
  { label: "报警因子", key: "factorName" },
  { label: "规则类型", key: "ruleName" },
  { label: "报警描述", key: "describe" },
  { label: "累计次数", key: "times" },
  { label: "数据时间", key: "spt" },
  { label: "报警时间", key: "alarmTime" },
  { label: "业务主题", key: "topicTypeName" },
  { label: "站点类型", key: "stationTypeNamex" },
  { label: "管控级别", key: "controlLevelName" },
  { label: "省份   ", key: "region1" },
  { label: "城市   ", key: "region2" },
  { label: "区县   ", key: "region3" },
  { label: "乡镇街道", key: "region4" },
  { label: "运维厂家", key: "operationFactory" },
  { label: "超标联系人", key: "exceededContact" },
  { label: "运维联系人", key: "operationContact" },
  { label: "河流   ", key: "river" },
];

const fields = text.map((item, idx) => {
  return {
    id: item.key,
    label: item.label,
    value: item.key,
    title: item.label,
    dataIndex: item.key,
    checked: idx < 8 ? true : false,
  };
});
function AlarmFiled({
  value = [],
  onChange,
  open,
  closeModal,
  onOk, //回调
  title = [], //标题
}) {
  const [loading, setLoading] = useState(false);
  const [data1, setData1] = useState(fields);
  const [rData, setRdata] = useState([]);

  useEffect(() => {
    onOk([...filterCheck(fields)]);
  }, []);

  useEffect(() => {
    setRdata([...filterOption(data1)]);
  }, [data1]);

  // 选择
  const onCheckChange = (item) => {
    if ("checked" in item) {
      item.checked = !item.checked;
    } else {
      item.checked = true;
    }
    setData1([...data1]);

    // freshData();

    let delIndex = rData.findIndex((ele) => ele.value === item.value);
    if (delIndex !== -1) {
      rData.splice(delIndex, 1);
    } else {
      rData.push(item);
    }
    setRdata([...rData]);
  };

  function findItem(item) {
    let res = data1.find((ele) => ele.value === item.value);

    return res;
  }

  const onCheckFalse = (item) => {
    let res = findItem(item);
    res.checked = false;
    rData.splice(item.idx, 1);
    setData1([...data1]);
    setRdata([...rData]);
  };

  const handleOk = async () => {
    setLoading(true);
    onOk(filterCheck(rData));
    setLoading(false);
  };

  // 拖拽
  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setRdata((previous) => {
        const activeIndex = previous.findIndex((i) => i.value === active.id);
        const overIndex = previous.findIndex((i) => i.value === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
    }
  };

  function SortableItem(props) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      setActivatorNodeRef,
      transition,
      isDragging,
    } = useSortable({ id: props.id });

    const style = {
      ...props.style,
      transform: CSS.Transform.toString(
        transform && {
          ...transform,
          scaleY: 1,
        }
      ),
      transition,
      ...(isDragging
        ? {
            position: "relative",
            zIndex: 9999,
          }
        : {}),
    };
    return (
      <div className="checkedList" style={style} {...attributes}>
        <MenuOutlined
          ref={setNodeRef}
          {...listeners}
          style={{ marginRight: "8px" }}
        />
        <span style={{ userSelect: "none" }}>{props.label}</span>
        <CloseOutlined className="close" onClick={() => onCheckFalse(props)} />
      </div>
    );
  }

  return (
    <Modal
      title={`设置显示字段`}
      onOk={handleOk}
      onCancel={() => closeModal(false)}
      open={open}
      maskClosable={false}
      width={800}
      confirmLoading={loading}
      destroyOnClose
    >
      <div className="form-factor-content">
        <div>
          <fieldset>
            <legend>{title[0]}</legend>
            <div style={{ width: "100%" }}>
              <Row
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  overflow: "auto",
                }}
              >
                {data1.slice(0, 8).map((item, idx) => (
                  <Col
                    span={6}
                    key={item.id + "-" + idx}
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
            <legend>{title[1]}</legend>
            <div style={{ width: "100%" }}>
              <Row
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  overflow: "auto",
                }}
              >
                {data1.slice(8).map((item, idx) => (
                  <Col
                    span={6}
                    key={item.id + "-" + idx}
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
          <div
            style={{
              height: "390px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <DndContext onDragEnd={onDragEnd}>
              <SortableContext
                // rowKey array
                items={rData.map((i) => i.value)}
                strategy={verticalListSortingStrategy}
              >
                {rData.map((item, idx) => {
                  return (
                    <SortableItem
                      key={item.id}
                      id={item.id}
                      {...item}
                      idx={idx}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AlarmFiled;
