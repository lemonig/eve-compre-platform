import React, { useState, useEffect } from "react";
import { DatePicker, Space, Select, TimePicker } from "antd";
import dayjs from "dayjs";

const timeOption = [
  {
    value: "mm",
    label: "分钟",
  },
  {
    value: "hh",
    label: "小时",
  },
  {
    value: "day",
    label: "日",
  },
  {
    value: "week",
    label: "周",
  },
  {
    value: "quarter",
    label: "季度",
  },
  {
    value: "year",
    label: "年",
  },
];
const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current > dayjs().endOf("day");
};

const PickerWithType = ({ type, value, onChange }) => {
  if (type === "mm" || type === "hh" || type === "day")
    return (
      <DatePicker
        value={dayjs("2021-9-6")}
        onChange={onChange}
        // disabledDate={disabledDate}
        defaultPickerValue={dayjs("2021-10-6")}
      />
    );
  if (type === "week")
    return (
      <DatePicker
        value={value}
        picker="week"
        onChange={onChange}
        disabledDate={disabledDate}
      />
    );
  if (type === "quarter")
    return (
      <DatePicker
        value={value}
        picker="quarter"
        onChange={onChange}
        disabledDate={disabledDate}
      />
    );
  if (type === "year")
    return (
      <DatePicker
        value={value}
        picker="year"
        onChange={onChange}
        disabledDate={disabledDate}
      />
    );
};

function LtimePicker({ value = {}, onChange }) {
  const [type, setType] = useState("mm");
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());

  const triggerChange = (changedValue) => {
    onChange?.({
      type,
      startTime,
      endTime,
      ...value,
      ...changedValue,
    });
  };

  const typeChange = (newVal) => {
    if (!("type" in value)) {
      setType(newVal);
    }
    triggerChange({
      type: newVal,
    });
  };

  const pickerStartChange = (newVal) => {
    if (!("setStartTime" in value)) {
      setStartTime(newVal);
    }
    triggerChange({
      startTime: newVal,
    });
  };
  const pickerEndChange = (newVal) => {
    if (!("endTime" in value)) {
      setEndTime(newVal);
    }
    triggerChange({
      endTime: newVal,
    });
  };

  return (
    <Space>
      <Select
        defaultValue="mm"
        style={{
          width: 120,
        }}
        value={value.type || type}
        options={timeOption}
        onChange={typeChange}
      />
      {/* <PickerWithType
        type={type}
        onChange={pickerStartChange}
        value={value.startTime || startTime}
      />
      至
      <PickerWithType
        type={type}
        onChange={pickerEndChange}
        value={value.endTime || endTime}
      /> */}
    </Space>
  );
}

export default LtimePicker;
