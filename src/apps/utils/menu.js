import menuData from "./menuData";

import { arrayToTree } from "./util";
import IconFont from "@Components/IconFont";

// const menuData = JSON.parse(localStorage.getItem("menuList"));
export function handleMenu(data) {
  let copy = JSON.parse(JSON.stringify(data));
  return arrayToTree(copy);
}
