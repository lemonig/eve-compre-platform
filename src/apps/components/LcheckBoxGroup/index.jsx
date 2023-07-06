import { Col, Row, Checkbox } from "antd";
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

  const onChangeCheckAll = (e) => {
    const list = e.target.checked ? options?.map((v) => v.value) : [];
    onChange(list);
  };
  const onChangeGroup = (list) => {
    onChange(list);
  };

  return (
    <div>
      <div
        style={{
          lineHeight: "32px",
        }}
      >
        {options.length ? (
          <Checkbox
            {...props}
            indeterminate={indeterminate}
            onChange={onChangeCheckAll}
            checked={checkAll}
          >
            {checkAllLabel}
          </Checkbox>
        ) : null}
      </div>
      <Checkbox.Group
        {...props}
        onChange={onChangeGroup}
        options={[]}
        style={{
          width: "90%",
        }}
      >
        <Row
          style={{
            width: "100%",
          }}
        >
          {options.map((item) => {
            return (
              <Col
                span={3}
                style={{
                  lineHeight: "32px",
                }}
              >
                <Checkbox value={item.value}>{item.label}</Checkbox>
              </Col>
            );
          })}
        </Row>
      </Checkbox.Group>
    </div>
  );
}

export default LcheckBoxGroup;
