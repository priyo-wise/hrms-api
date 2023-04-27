import React, { useEffect, useRef } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { WebService } from "./Services/WebService";
import { setCompanyInfo } from "./Services/authSlice";
import Cookies from 'universal-cookie';

const Auth = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const fetchAndSetCompanyInfo = () => {
    const endPoint = `CompanyProfile?select=CompanyId,CompanyName,Phone,Email,Fax,Logo,IsDefault,Code
    &where=${
      (searchParams.get("company") ?? "") != ""
        ? `Code eq '${searchParams.get("company")}'`
        : "IsDefault eq 1"
    }`;
    WebService({
      dispatch,
      endPoint,
    }).then((c) => {
      if (c.length > 0) {
        dispatch(setCompanyInfo(c[0]));
        cookies.set('company', JSON.stringify(c[0]), { path: '/' });
      } else {
        navigate("/Auth");
      }
    });
  };
  useEffect(() => {
      fetchAndSetCompanyInfo();
  }, [searchParams]);
  // const navigate = useNavigate();
  // const loged=useSelector((state) => state.auth.loged);
  // useEffect(()=>{
  //   alert(loged);
  // },loged);
  return (
    <>
      <Outlet />
    </>
  );
};
export default Auth;
