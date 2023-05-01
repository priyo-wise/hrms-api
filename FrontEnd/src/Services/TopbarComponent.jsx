import { Box } from "@mui/material";
import React from "react";
import BreadcrumbsComponent from "./BreadcrumbsComponent";

const ActionButton = ({ bData, HeadingText, ...rest }) => {
  HeadingText ??= "";

  return (
    <>
      <Box
        sx={{
          p: 0,
          width: 1,
          height: 80,
        }}
      >
        <h3 className="ms-4 mt-2">{HeadingText}</h3>
        <div className="ms-4">
          {" "}
          <BreadcrumbsComponent bData={bData}></BreadcrumbsComponent>
        </div>
      </Box>
    </>
  );
};

export default ActionButton;
