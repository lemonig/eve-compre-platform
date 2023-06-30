import React, { useState, useEffect } from "react";
import { Modal, Form, Spin } from "antd";
import FactorSelect from "@Components/FactorSelect";

function FactorSelectModal({ record, open, factorSelectCallback }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [confirmLoading, setConfrimLoading] = useState(false);
  useEffect(() => {
    if (!!record.length) {
      console.log(record);
      form.setFieldsValue({
        factorIdList: record,
      });
    }
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setConfrimLoading(true);
    console.log(values);
    factorSelectCallback(values.factorIdList);
    setConfrimLoading(false);
  };
  return (
    <Modal
      title={`选择因子`}
      open={open}
      onOk={handleOk}
      onCancel={() => factorSelectCallback(false)}
      maskClosable={false}
      width={860}
      confirmLoading={confirmLoading}
    >
      {loading ? (
        <div style={{ textAlign: "center" }}>
          <Spin></Spin>
        </div>
      ) : (
        <div>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 18 }}
            autoComplete="off"
            form={form}
            colon={false}
            layout="inline"
          >
            <Form.Item
              name="factorIdList"
              wrapperCol={{
                span: 24,
              }}
              style={{
                width: "100%",
              }}
            >
              <FactorSelect />
            </Form.Item>
          </Form>
        </div>
      )}
    </Modal>
  );
}

export default FactorSelectModal;
