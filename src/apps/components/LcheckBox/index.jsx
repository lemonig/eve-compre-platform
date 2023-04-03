import React, { useEffect, useState } from "react";
import { Checkbox } from "antd";

function LcheckBox({ value, onChange, options = [] }) {
  const [checkList, setCheckList] = useState([]);
  useEffect(() => {
    let temp = JSON.parse(JSON.stringify(options));
    setCheckList(temp);
  }, []);

  useEffect(() => {
    //解决初始化赋值问题
    if (typeof value == "undefined") {
      let temp = JSON.parse(JSON.stringify(options));
      temp.map((item) => {
        item.checked = false;
      });
      setCheckList([...temp]);
    }
  }, [value]);

  // useEffect(() => {
  //   let temp = JSON.parse(JSON.stringify(options));

  // }, [JSON.stringify(value)]);

  const onCheckChange = (e, checkItem) => {
    let newList = checkList.map((item) => {
      if (item.value === checkItem.value) {
        item.checked = e.target.checked;
      } else {
        item.checked = false;
      }
      return item;
    });
    setCheckList(newList);
    onChange?.(e.target.checked ? checkItem.value : "");
  };
  return (
    <div>
      {checkList?.map((item) => {
        return (
          <Checkbox
            onChange={(e) => onCheckChange(e, item)}
            checked={item.checked}
            key={item.value}
          >
            {item.label}
          </Checkbox>
        );
      })}
    </div>
  );
}

export default LcheckBox;
