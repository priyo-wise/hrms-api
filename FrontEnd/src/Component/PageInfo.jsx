import React from "react";
import { useSelector } from "react-redux";
import _ from "underscore";

const { useEffect } = React;
export const PageInfo = ({ pageTitle }) => {
  useEffect(() => {
    if (pageTitle !== null) document.title = `Wise: ${pageTitle ?? ""}`;
    else document.title = "Wise";
  }, [pageTitle]);
};
export const ActionPermission = (systemCode) => {
  const permission = useSelector((s) => s.auth.PermissionList??[]);
  const permissionCode = useSelector((s) => s.auth.PermissionCodeList??[]);

  const permissioncheckData=(_.findWhere(permission ?? [], {
    Code: _.findWhere(permissionCode ?? [], { SystemCode: systemCode })
      ?.DBCode,
  })?.PermissionId||null) !== null;
  
  return (_.findWhere(permission ?? [], {
      Code: _.findWhere(permissionCode ?? [], { SystemCode: systemCode })
        ?.DBCode,
    })?.PermissionId||null) !== null;
};
