import { Form, Button, Checkbox } from "antd";
import React, { useMemo } from "react";

function LcheckBoxGroup(props) {
  const { onChange, value, checkAllLabel, options } = props;
  const { checkAll, indeterminate } = useMemo(() => {
    if (!value || !options) {
      return {
        checkAll: false,
        indeterminate: false,
      };
    }
    return {
      checkAll: value.length === options.length,
      indeterminate: !!value.length && value.length < options.length,
    };
  }, [value, options]);
  // 选择所
  const onChangeCheckAll = (e) => {
    // 如果不全选就是空
    const list = e.target.checked ? options?.map((v) => v.value) : [];
    onChange(list);
  };
  const onChangeGroup = (list) => {
    onChange(list);
  };
  return (
    <div>
      <Checkbox
        {...props}
        indeterminate={indeterminate}
        onChange={onChangeCheckAll}
        checked={checkAll}
      >
        {checkAllLabel}
      </Checkbox>
      <Checkbox.Group {...props} onChange={onChangeGroup} />
    </div>
  );
}

export default LcheckBoxGroup;
