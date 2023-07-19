import React, { useEffect, useState, useMemo } from "react";
import LayMenu from "@App/layout/lay-menu";
import StationTree from "@Shared/stationTree";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import { Tabs, Empty } from "antd";
import DataTable from "./components/DataTable";
import MultParam from "./components/MultParam";
import SingleParam from "./components/SingleParam";

import { handleMenu } from "@Utils/menu";
import { useDispatch, useSelector } from "react-redux";

import { getFactor, searchMeta, chartEvaluateIndex } from "@Api/data-list.js";

function DataList() {
  const [menuSelect, setMenuSelect] = useState({
    title: "",
    key: "",
    query: "",
    ptitle: "",
  });

  const [stationSelect, setStationSelect] = useState({
    title: "",
    key: "",
  });

  const [activeKey, setActiveKey] = useState("1");
  const [facList, setFacList] = useState([]); //因子
  const [metaData, setMetaData] = useState({
    computeDataLevel: [],
    dataSource: [],
    stationField: [],
    evaluateIndex: [],
  });
  const [evaluteList, setEvaluteList] = useState([]);

  useEffect(() => {
    if (dataMenu.children && dataMenu.children.length) {
      setMenuSelect({
        key: dataMenu.children[0].children[0].id,
        title: dataMenu.children[0].children[0].title,
        query: dataMenu.children[0].children[0].query,
        ptitle: dataMenu.children[0].title,
      });
    }
  }, []);

  const menu = useSelector((state) => state.menu);
  const menuTree = menu ? handleMenu(menu) : [];

  let dataMenu = menuTree
    .find((ele) => ele.label === "数据查询")
    .children.find((ele) => ele.label === "监测数据");
  dataMenu &&
    dataMenu?.children &&
    dataMenu?.children.forEach((element) => {
      element.type = "group";
    });

  const onMenuChange = ({ key, title, query, ptitle }) => {
    setMenuSelect({
      title,
      key: key[0],
      query,
      ptitle,
    });
  };

  const onTabChange = (key) => {
    setActiveKey(key);
  };

  const onStationChange = (e) => {
    setStationSelect(e);
  };
  // 站点改变
  useEffect(() => {
    if (stationSelect.key) {
      //因为因子选择的来源是这两个，两个请求不知道什么时候到，将请求依次到位后再更新，
      Promise.all([getEvaluteData(), getMetaData(), getFactorData()]).then(
        (res) => {
          setEvaluteList(res[0]);
          setMetaData(res[1]);
          setFacList(res[2]);
        }
      );
    }
  }, [stationSelect.key]);

  const getFactorData = async () => {
    let { data } = await getFactor({
      id: stationSelect.key,
    });
    data?.forEach((item) => {
      item.checked = true;
    });
    return data;
  };

  const getMetaData = async () => {
    let { data, success } = await searchMeta({
      id: menuSelect.query,
    });
    if (success) {
      return data;
    }
  };
  const getEvaluteData = async () => {
    let { data, success } = await chartEvaluateIndex({
      id: stationSelect.key,
    });
    if (success) {
      return data;
    }
  };

  const tableComponent = useMemo(() => {
    console.log(metaData);
    return (
      <DataTable
        stationMsg={stationSelect}
        menuMsg={menuSelect}
        facList={facList}
        metaData={metaData}
      />
    );
  }, [facList]);

  const items = [
    {
      key: "1",
      label: `站点数据`,
      children:
        menuSelect.key &&
        stationSelect.key &&
        facList.length &&
        metaData.dataSource.length &&
        activeKey == 1 &&
        tableComponent,
    },
    {
      key: "2",
      label: `单站单参分析`,
      children: menuSelect.key &&
        stationSelect.key &&
        facList.length &&
        metaData.dataSource.length &&
        activeKey == 2 && (
          <SingleParam
            stationMsg={stationSelect}
            menuMsg={menuSelect}
            facList={facList}
            metaData={metaData}
            evaluteList={evaluteList}
            // key={stationSelect.key}
          />
        ),
    },
    {
      key: "3",
      label: `单站多参分析`,
      children: menuSelect.key &&
        stationSelect.key &&
        facList.length &&
        metaData.dataSource.length &&
        activeKey == 3 && (
          <MultParam
            stationMsg={stationSelect}
            menuMsg={menuSelect}
            facList={facList}
            metaData={metaData}
            evaluteList={evaluteList}
          />
        ),
    },
  ];

  return (
    <>
      {"children" in dataMenu ? (
        <>
          <LayMenu
            menuList={dataMenu.children}
            onChange={onMenuChange}
            value={[dataMenu.children[0].children[0].id]}
          />
          <section className="main-content">
            {!!menuSelect.query ? (
              <StationTree
                query={menuSelect.query}
                onChange={onStationChange}
              />
            ) : null}
            <div className="content-wrap">
              <Lbreadcrumb
                data={[
                  "数据查询",
                  "监测数据",
                  `${menuSelect.ptitle}`,
                  `${menuSelect.title}`,
                ]}
              />
              <h2 className="satation-name">{stationSelect.title}</h2>
              <Tabs
                defaultActiveKey="1"
                activeKey={activeKey}
                items={items}
                onChange={onTabChange}
                animated={true}
                destroyInactiveTabPane={true}
              />
            </div>
          </section>
        </>
      ) : (
        <Empty style={{ width: "100%", alignSelf: "center" }} />
      )}
    </>
  );
}

export default DataList;
