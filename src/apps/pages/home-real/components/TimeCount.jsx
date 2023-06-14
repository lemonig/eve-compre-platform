import React, { useState, useEffect } from "react";
import { Checkbox } from "antd";

function TimeCount({ callback }) {
  const [seconds, setSeconds] = useState(60); //倒计时
  const [isCounting, setIsCounting] = useState(true); // 计时器启停状态

  useEffect(() => {
    if (seconds === 0) {
      callback();
      setSeconds(60);
    }
  }, [seconds]);

  useEffect(() => {
    if (isCounting) {
      const interval = setInterval(() => {
        setSeconds((se) => se - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isCounting]);

  const onCheckChange = (e) => {
    setIsCounting(e.target.checked);
  };

  return (
    <Checkbox onChange={onCheckChange} checked={isCounting}>
      <span className="">{seconds}</span>秒后刷新
    </Checkbox>
  );
}

export default TimeCount;
