import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { metaList } from "@Api/util.js";

function MetaSelect({
  value,
  onChange,
  dictType,
  fieldNames = {
    label: "dictLabel",
    value: "dictValue",
  },
  ...props
}) {
  const [list, setList] = useState();
  useEffect(() => {
    const getMetaData = async () => {
      let { data } = await metaList({
        dictType: dictType,
      });
      setList(data);
    };
    getMetaData();
  }, []);

  return (
    <Select
      // className="width-3"
      options={list}
      placeholder="请选择"
      fieldNames={fieldNames}
      value={value}
      onChange={onChange}
      style={{ width: "300px" }}
      {...props}
    />
  );
}

export default MetaSelect;
