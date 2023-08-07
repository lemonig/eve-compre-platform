import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Button,
  Space,
  Table,
  Tag,
  Modal,
  Form,
  message,
  Tooltip,
  PageHeader,
  DatePicker,
  Checkbox,
  Col,
  Row,
  Divider,
  Drawer,
  Cascader,
  TreeSelect,
} from "antd";
import IconFont from "@Components/IconFont";
import PageHead from "@Components/PageHead";
import MetaSelect from "@Shared/MetaSelect";
import dayjs from "dayjs";
import '../index.less'

import {
  stationAdd,
  stationUpdate,
  stationPage,
  stationGet,
} from "@Api/set_station.js";
import {
  fieldUpdate,
  fieldList as fieldListApi,
  fieldDelete,
} from "@Api/set_meta_field.js";
import { inputTrim } from "@Utils/util";
import { metaBatchList } from "@Api/util.js";

import {
  stationPage as stationMetaPage,
  stationGet as stationMetaGet,
} from "@Api/set_meta_station.js";

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

function Detail({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);


  useEffect(() => {

  }, []);




  const getfieldList = async () => {
    let { data } = await fieldListApi();
  };



  const getDetail = async () => {
    let { data } = await stationGet({
      id: record.id,
    });


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
      <p className="site-description-item-profile-p">基本资料</p>
      <Row>
        <Col span={12}>
          <DescriptionItem title="Full Name" content="Lily" />
        </Col>
        <Col span={12}>
          <DescriptionItem title="Account" content="AntDesign@example.com" />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem title="City" content="HangZhou" />
        </Col>
        <Col span={12}>
          <DescriptionItem title="Country" content="China🇨🇳" />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem title="Birthday" content="February 2,1900" />
        </Col>
        <Col span={12}>
          <DescriptionItem title="Website" content="-" />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <DescriptionItem
            title="Message"
            content="Make things as simple as possible but no simpler."
          />
        </Col>
      </Row>
      <Divider />
      <p className="site-description-item-profile-p">站点位置</p>
      <Row>
        <Col span={12}>
          <DescriptionItem title="Position" content="Programmer" />
        </Col>
        <Col span={12}>
          <DescriptionItem title="Responsibilities" content="Coding" />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem title="Department" content="XTech" />
        </Col>
        <Col span={12}>
          <DescriptionItem title="Supervisor" content={<a>Lin</a>} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <DescriptionItem
            title="Skills"
            content="C / C + +, data structures, software engineering, operating systems, computer networks, databases, compiler theory, computer architecture, Microcomputer Principle and Interface Technology, Computer English, Java, ASP, etc."
          />
        </Col>
      </Row>
      <Divider />
      <p className="site-description-item-profile-p">站点因子</p>
      <Row>
        <Col span={12}>
          <DescriptionItem title="Email" content="AntDesign@example.com" />
        </Col>
        <Col span={12}>
          <DescriptionItem title="Phone Number" content="+86 181 0000 0000" />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <DescriptionItem
            title="Github"
            content={
              <a href="http://github.com/ant-design/ant-design/">
                github.com/ant-design/ant-design/
              </a>
            }
          />
        </Col>
      </Row>
      <Divider />
      <p className="site-description-item-profile-p">通讯设置</p>
      <Row>
        <Col span={12}>
          <DescriptionItem title="Email" content="AntDesign@example.com" />
        </Col>
        <Col span={12}>
          <DescriptionItem title="Phone Number" content="+86 181 0000 0000" />
        </Col>
      </Row>
      <Divider />
      <p className="site-description-item-profile-p">其它</p>
      <Row>
        <Col span={12}>
          <DescriptionItem title="Email" content="AntDesign@example.com" />
        </Col>
        <Col span={12}>
          <DescriptionItem title="Phone Number" content="+86 181 0000 0000" />
        </Col>
      </Row>

    </Drawer>

  );
}

export default Detail;
