import React from "react";
import IconFont from "@Components/IconFont";

// 数组转树
export function arrayToTree(items) {
  const result = []; // 存放结果集
  const itemMap = {}; //
  for (const item of items) {
    item.key = item.id;
    const id = item.id;
    const pid = item.pid;
    if (item.icon && typeof item.icon === "string") {
      item.icon = <IconFont name={item.icon} size={16}></IconFont>;
    }
    if (!itemMap[id] && !item.isleaf) {
      itemMap[id] = {
        children: [],
      };
    }

    // itemMap[id] = {
    //   ...item,
    //   children: itemMap[id]["children"],
    // };
    if (!item.isleaf) {
      itemMap[id] = {
        ...item,
        children: itemMap[id]["children"],
      };
    } else {
      itemMap[id] = item;
    }

    const treeItem = itemMap[id];

    if (pid == 0) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        };
      }
      itemMap[pid].children.push(treeItem);
    }
  }
  return result;
}

//节流
export function throttle(fun, delay) {
  // let last, deferTimer;
  // return function (args) {
  //   let that = this;
  //   let _args = arguments;
  //   let now = +new Date();
  //   if (last && now - last < delay) {
  //     clearTimeout(deferTimer);
  //     deferTimer = setTimeout(function () {
  //       last = now;
  //       fun.apply(that, _args);
  //     }, delay);
  //   } else {
  //     last = now;
  //     fun.apply(that, _args);
  //   }
  // };
  var timer;
  return function () {
    var _this = this;
    var args = arguments;
    if (timer) {
      return;
    }
    timer = setTimeout(function () {
      fun.apply(_this, args);
      timer = null; // 在delay后执行完fn之后清空timer，此时timer为假，throttle触发可以进入计时器
    }, delay);
  };
}

export function inputTrim(e) {
  return e.target.value.replace(/(^\s*)|(\s*$)/g, "");
}
