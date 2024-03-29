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
                data.header.map((item, idx) => {
                  return <th>
                    <p>
                      {item}
                    </p>
                    <p>
                      {data.unit[idx] ? `(${data.unit[idx]})` : null}
                    </p>
                  </th>
                })
              }

            </tr>
            {
              data.body.map((item, idx) => {
                return <tr>
                  <td>{idx + 1}</td>
                  {
                    item.map(jtem => <td>{jtem}</td>)
                  }


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
