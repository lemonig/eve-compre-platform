import React from "react";
import IconFont from "@Components/IconFont";
import dayjs from "dayjs";
// 数组转树
// export function arrayToTree(items) {
//   const result = []; // 存放结果集
//   const itemMap = {}; //
//   for (const item of items) {
//     item.key = item.id;
//     const id = item.id;
//     const pid = item.pid;
//     // if (item.icon && typeof item.icon === "string") {
//     //   item.icon = <IconFont name={item.icon} size={16}></IconFont>;
//     // }
//     if (!itemMap[id] && !item.isleaf) {
//       itemMap[id] = {
//         children: [],
//       };
//     }

//     if (!item.isleaf) {
//       itemMap[id] = {
//         ...item,
//         children: itemMap[id]["children"],
//       };
//     } else {
//       itemMap[id] = item;
//     }

//     const treeItem = itemMap[id];

//     if (pid == 0) {
//       result.push(treeItem);
//     } else {
//       console.log(itemMap[pid]);
//       if (!itemMap[pid]) {
//         itemMap[pid] = {
//           children: [],
//         };
//       }
//       console.log(itemMap[pid]);

//       itemMap[pid].children.push(treeItem);
//     }
//   }
//   return result;
// }

export function arrayToTree(data) {
  const parent = data.filter(
    (value) => value.pid === "undefined" || value.pid === null || value.pid == 0
  );
  const children = data.filter(
    (value) => value.pid !== "undefined" && value.pid !== null && value.pid != 0
  );
  const translator = (parent, children) => {
    parent.forEach((parent) => {
      children.forEach((current, index) => {
        if (current.pid === parent.id) {
          const temp = JSON.parse(JSON.stringify(children));
          temp.splice(index, 1);
          translator([current], temp);
          typeof parent.children !== "undefined"
            ? parent.children.push(current)
            : (parent.children = [current]);
        }
      });
    });
  };
  translator(parent, children);
  return parent;
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

export function formatePickTime(type, value) {
  if (type === "mm") {
    return dayjs(value).format("YYYYMMDDHHmm");
  } else if (type === "hh") {
    return dayjs(value).format("YYYYMMDDHH");
  } else if (type === "d") {
    return dayjs(value).format("YYYYMMDD");
  } else if (type === "w") {
    return dayjs(value).format("YYYYWW");
  } else if (type === "m") {
    return dayjs(value).format("YYYYMM");
  } else if (type === "q") {
    return dayjs(value).format("YYYY0Q");
  } else if (type === "y") {
    return dayjs(value).format("YYYY");
  }
}

// 找出最小数据频次
export function findMinFrequent(list) {
  if (!Array.isArray(list)) {
    return;
  }
  if (list.includes("mm")) {
    return "mm";
  } else if (list.includes("hh")) {
    return "hh";
  } else if (list.includes("d")) {
    return "d";
  } else if (list.includes("w")) {
    return "w";
  } else if (list.includes("m")) {
    return "m";
  } else if (list.includes("q")) {
    return "q";
  } else if (list.includes("y")) {
    return "y";
  }
}

//表单默认时间格式化
export function formPickTime(type) {
  if (type === "mm") {
    return {
      startTime: dayjs().subtract(6, "day").startOf("day"),
      endTime: dayjs().endOf("day"),
      type: type,
    };
  } else {
    return {
      startTime: dayjs().subtract(1, "month").startOf("day"),
      endTime: dayjs().endOf("day"),
      type: type,
    };
  }
  // } else if (type === "hh") {
  //   return dayjs(value).startOf("day");
  // }
  // else if (type === "d") {
  //   return dayjs(value).startOf("day");
  // } else if (type === "w") {
  //   return dayjs(value).startOf("week");
  // } else if (type === "m") {
  //   return dayjs(value).startOf("month");
  // } else if (type === "q") {
  //   return dayjs(value);
  // } else if (type === "y") {
  //   return dayjs(value).startOf("year");
  // }
}
export function tableIndex(data) {
  data.forEach((item, idx) => {
    // item.key = pageMsg.pagination.current + "-" + idx;
    item.index = idx + 1;
  });
  return data;
}
