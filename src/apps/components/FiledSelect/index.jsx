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

function filterCheck(data) {
  return data.filter((ele) => ele.checked).map((item) => item.value);
}
function filterOption(data) {
  return data.filter((ele) => ele.checked);
}

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
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [rData, setRdata] = useState([]);

  useEffect(() => {
    setData1(JSON.parse(JSON.stringify(options1)));
  }, [options1]);
  useEffect(() => {
    setData2(JSON.parse(JSON.stringify(options2)));
  }, [options2]);
  useEffect(() => {
    setData3(JSON.parse(JSON.stringify(options3)));
  }, [options3]);

  useEffect(() => {
    if (data1.length && data2.length && data3.length) {
      onOk([
        ...filterCheck(data1),
        ...filterCheck(data2),
        ...filterCheck(data3),
      ]);
      setRdata([...filterOption(data1), ...filterOption(data2), ...data3]);
    }
  }, [data1, data2, data3]);

  // useEffect(() => {
  // }, options3)]);

  // 选择
  const onCheckChange = (item) => {
    if ("checked" in item) {
      item.checked = !item.checked;
    } else {
      item.checked = true;
    }
    setData1([...data1]);
    setData2([...data2]);
    setData3([...data3]);
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
    let res =
      data1.find((ele) => ele.value === item.value) ||
      data2.find((ele) => ele.value === item.value) ||
      data3.find((ele) => ele.value === item.value);
    return res;
  }

  const onCheckFalse = (item) => {
    let res = findItem(item);
    res.checked = false;
    rData.splice(item.idx, 1);
    setData1([...data1]);
    setData2([...data2]);
    setData3([...data3]);
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

  const DragItem = (children, ...props) => {
    console.log(children);
    const {
      attributes,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: children["id"],
    });

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
      <div {...props} ref={setNodeRef} style={style} {...attributes}>
        {React.Children.map(children, (child) => {
          if (child.key === "sort") {
            return React.cloneElement(child, {
              children: (
                <MenuOutlined
                  ref={setActivatorNodeRef}
                  style={{
                    touchAction: "none",
                    cursor: "move",
                  }}
                  {...listeners}
                />
              ),
            });
          }
          return child;
        })}
      </div>
    );
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
            <legend>站点属性</legend>
            <div style={{ width: "100%" }}>
              <Row
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  overflow: "auto",
                }}
              >
                {data1.map((item, idx) => (
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
            <legend>评价因子</legend>
            <div style={{ width: "100%" }}>
              <Row
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  overflow: "auto",
                }}
              >
                {data2.map((item, idx) => (
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
            <legend>监测因子</legend>
            <div style={{ width: "100%" }}>
              <Row
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  overflow: "auto",
                }}
              >
                {data3.map((item, idx) => (
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
                      key={item.value}
                      id={item.value}
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

export default FiledSelect;
