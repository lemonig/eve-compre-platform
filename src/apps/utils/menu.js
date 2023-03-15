import menuData from "./menuData";

import { arrayToTree } from "./util";
import IconFont from "@Components/IconFont";

// const menuData = JSON.parse(localStorage.getItem("menuList"));
export function handleMenu(data) {
  let copy = JSON.parse(JSON.stringify(data));
  // console.log(arrayToTree(copy));
  // copy.map((item) => {
  //   if (item.icon && typeof item.icon === "string") {
  //     item.icone = <IconFont name={item.icon} size={16}></IconFont>;
  //   }
  // });
  return arrayToTree(copy);
}
