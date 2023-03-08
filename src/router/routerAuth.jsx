import React from "react";
import { matchRoutes, useLocation, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export const RouterAuth = ({ children }) => {
  // const router = useSelector((state) => state.menu);
  const router = JSON.parse(localStorage.getItem("menuList"));
  const location = useLocation();
  if (!router || !router.length) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  const mathchs = matchRoutes(router, location);
  const hasAuth = mathchs?.some((item) => {
    const route = item?.route;
    if (!route) return false;
    return true;
  });

  if (!hasAuth) {
    return <Navigate to="/404" state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};
