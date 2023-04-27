import React from "react";

const { useEffect } = React;
export const PageInfo = (props) => {
  const { pageTitle } = props;
  useEffect(() => {
    if (props?.pageTitle !== null) document.title = `Wise: ${pageTitle ?? ""}`;
    else document.title = "Wise";
  }, [props?.pageTitle]);
};
