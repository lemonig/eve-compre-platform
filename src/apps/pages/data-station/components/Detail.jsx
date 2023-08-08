import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Divider,
  Drawer,
} from "antd";
import IconFont from "@Components/IconFont";
import '../index.less'
import { stationInfo } from "@Api/data_info.js";


const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

function Detail({ record, open, closeModal }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([])


  useEffect(() => {
    getDetail()
  }, []);

  const getDetail = async () => {
    let { data } = await stationInfo({
      id: record.id,
    });
    setData(data)
  };

  return (
    <Drawer width={640} placement="right" closable={false} onClose={closeModal} open={open}>
      <p
        className="site-description-item-profile-p"
        style={{
          marginBottom: 24,
        }}
      >
        站点详情
      </p>
      {
        data.map(item => {
          return <>
            <p className="site-description-item-profile-p">{item.name}</p>
            <Row>
              {
                item.list.map(jtem => {
                  return <Col span={12}>
                    <DescriptionItem title={jtem.name} content={jtem.value} />
                  </Col>
                })
              }
            </Row>
            <Divider />
          </>
        })
      }

    </Drawer>

  );
}

export default Detail;
