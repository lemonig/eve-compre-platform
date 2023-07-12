import React, { useState, useEffect } from "react";
import { Modal } from "antd";

import StationSelect from "@Components/StationSelect";

function StationForm({
  list = [],
  options,
  open,
  onOK,
  onCancel,
  defaultStationType,
}) {
  const [loading, setLoading] = useState(false);
  const [selectIds, setSelectIds] = useState([]);

  const onStationChange = (id) => {
    setSelectIds(id);
  };
  useEffect(() => {
    setSelectIds(list || []);
  }, [list]);

  return (
    <>
      <Modal
        title={`选择站点`}
        open={open}
        onOk={() => onOK(selectIds)}
        onCancel={onCancel}
        maskClosable={false}
        width={888}
        confirmLoading={loading}
      >
        <div>
          <StationSelect
            onChange={onStationChange}
            value={list}
            options={options}
            defaultStationType={defaultStationType}
          />
        </div>
      </Modal>
    </>
  );
}

export default StationForm;
