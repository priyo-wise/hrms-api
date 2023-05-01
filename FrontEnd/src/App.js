import "./App.css";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import HeaderComponent from "./Component/Layout/HeaderComponent";
import SideBarComponent from "./Component/Layout/SideBarComponent";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WebService } from "./Services/WebService";
import { setPermission, setMenu } from "./Services/authSlice";
import _, { where } from "underscore";
import Cookies from 'universal-cookie';

const App = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const renderAfterCalled = useRef(false);
  const menu = useSelector((state) => state.auth.MenuList);
  useSelector(async (state) => {
    if (!state.auth.loged) {
      navigate(`/Auth?company=${(cookies.get('company')??{}).Code}`);
    }
  });
  useEffect(() => {
    if (!renderAfterCalled.current) {
      WebService({ dispatch, endPoint: "User/Permission" }).then((res) => {
        dispatch(setMenu(res.Menu));
        dispatch(setPermission(res.Permission));
      });
    }
    renderAfterCalled.current = true;
  }, []);
  useEffect(() => {
    if (location.pathname !== "/" && location.pathname.indexOf("/Common")<0) {
      if (where(menu??[], { Route: location.pathname.substring(1) }).length < 1)
        navigate("/");
    }
  }, [location.pathname]);
  return (
    <>
      <div className="d-flex flex-column flex-lg-row h-lg-full bg-surface-secondary">
        <SideBarComponent />
        <Outlet />
      </div>
    </>
  );
};

export default App;
