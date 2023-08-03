import React, { useState, useEffect } from "react";
import {
  Modal,
  Empty,
} from "antd";

import { pageAlarmdetail } from "@Api/alarm.js";
import './index.less'

function StationDetail({ record, open, closeModal }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    header: [],
    body: [],
  });
  useEffect(() => {
    console.log(record);
    getPageData();

  }, []);


  const getPageData = async () => {
    let { data } = await pageAlarmdetail({
      id: record.id,
    });
    setData(data)
    setLoading(false);
  };

  return (
    <Modal
      title={record?.stationName}
      open={open}
      onCancel={() => closeModal(false)}
      maskClosable={false}
      width={860}
      footer={null}
    >
      {data.body.length ? (
        <div className="change_table">
          <table>

            <tr>
              <th>序号</th>
              {
                data.header.map(item => {
                  return <th>{item}</th>
                })
              }

            </tr>
            {
              data.body.map((item, idx) => {
                return <tr>
                  <td>{idx + 1}</td>
                  <td>{item[0]}</td>
                  <td>{item[1]}</td>
                </tr>
              })
            }

          </table>
        </div>
      )
        :
        <Empty></Empty>

      }
    </Modal>
  );
}

export default StationDetail;
