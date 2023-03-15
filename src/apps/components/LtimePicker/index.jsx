import React, { useState, useEffect } from "react";
import { DatePicker, Space, Select, TimePicker } from "antd";
import dayjs from "dayjs";

const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current > dayjs().endOf("day");
};

const formatePickTime = (type, value) => {
  console.log(Object.prototype.toString.call(value));
  // if (Object.prototype.toString.call(value) === "[object Date]") {
  if (type === "mm" || type === "hh" || type === "d") {
    return dayjs(value).format("YYYYMMDDHHmm");
  } else if (type === "w") {
    return dayjs(value).format("YYYYMMWW");
  } else if (type === "m") {
    return dayjs(value).format("YYYYMM");
  } else if (type === "q") {
    return dayjs(value).format("YYYYQ");
  } else if (type === "y") {
    return dayjs(value).format("YYYY");
  }
  // }
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

function LtimePicker({ value = {}, onChange, options = [] }) {
  const [type, setType] = useState("");
  const [startTime, setStartTime] = useState(dayjs().subtract(1, "month"));
  const [endTime, setEndTime] = useState(dayjs());

  useEffect(() => {
    setStartTime(value.startTime);
    setEndTime(value.endTime);
    setType(options[0]?.value);
  }, []);
  useEffect(() => {}, []);
  const triggerChange = (changedValue) => {
    onChange?.({
      type,
      startTime: formatePickTime(type, startTime),
      endTime: formatePickTime(type, endTime),
      ...value,
      ...changedValue,
    });
  };

  const typeChange = (newVal) => {
    setType(newVal);
    triggerChange({
      type: newVal,
    });
  };

  const pickerStartChange = (newVal) => {
    if (!("setStartTime" in value)) {
      setStartTime(newVal);
    }
    triggerChange({
      startTime: formatePickTime(type, newVal),
    });
  };
  const pickerEndChange = (newVal) => {
    if (!("endTime" in value)) {
      setEndTime(newVal);
    }
    triggerChange({
      endTime: formatePickTime(type, newVal),
    });
  };

  return (
    <Space>
      <Select
        defaultValue="mm"
        style={{
          width: 120,
        }}
        // value={type}
        options={options}
        onChange={typeChange}
      />
      <PickerWithType
        type={type}
        onChange={pickerStartChange}
        value={value.startTime || startTime}
      />
      至
      <PickerWithType
        type={type}
        onChange={pickerEndChange}
        value={value.endTime || endTime}
      />
    </Space>
  );
}

export default LtimePicker;
