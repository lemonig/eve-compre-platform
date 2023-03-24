import React, { useEffect, useState } from "react";
import { Checkbox } from "antd";

function LcheckBox({ value = "", onChange, options = [] }) {
  const [checkList, setCheckList] = useState([]);
  useEffect(() => {
    setCheckList(JSON.parse(JSON.stringify(options)));
  }, []);

  const onCheckChange = (e, checkItem) => {
    console.log(e);
    console.log(checkItem);
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
      {checkList.map((item) => {
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
