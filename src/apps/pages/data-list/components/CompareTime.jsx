import React, { useState, useEffect } from "react";
import { DatePicker, Space, Select, TimePicker } from "antd";
import dayjs from "dayjs";

// i have never thouht that it will wright again,but it did ,beacuse i dont know it
const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current > dayjs().endOf("day");
};

const PickerWithType = ({ type, value, onChange }) => {
  if (type === "mm" || type === "hh" || type === "d")
    return (
      <DatePicker
        value={dayjs(value)}
        onChange={onChange}
        disabledDate={disabledDate}
        // defaultPickerValue={dayjs("2021-10-6")}
      />
    );
  else if (type === "w")
    return (
      <DatePicker
        value={value}
        picker="week"
        onChange={onChange}
        disabledDate={disabledDate}
      />
    );
  else if (type === "m")
    return (
      <DatePicker
        value={value}
        picker="month"
        onChange={onChange}
        disabledDate={disabledDate}
      />
    );
  else if (type === "q")
    return (
      <DatePicker
        value={value}
        picker="quarter"
        onChange={onChange}
        disabledDate={disabledDate}
      />
    );
  else if (type === "y")
    return (
      <DatePicker
        value={value}
        picker="year"
        onChange={onChange}
        disabledDate={disabledDate}
      />
    );
  else {
    return (
      <DatePicker
        value={value}
        onChange={onChange}
        disabledDate={disabledDate}
        // defaultPickerValue={dayjs("2021-10-6")}
      />
    );
  }
};

function CompareTime({ value = {}, onChange, type }) {
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());

  useEffect(() => {}, []);
  const triggerChange = (changedValue) => {
    onChange?.({
      startTime,
      endTime,
      ...value,
      ...changedValue,
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
      <PickerWithType
        type={value.type || type}
        onChange={pickerStartChange}
        value={value.startTime || startTime}
      />
      至
      <PickerWithType
        type={value.type || type}
        onChange={pickerEndChange}
        value={value.endTime || endTime}
      />
    </Space>
  );
}

export default CompareTime;
