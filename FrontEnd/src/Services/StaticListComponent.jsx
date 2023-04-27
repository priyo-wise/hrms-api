import React from "react";
import Container from "react-bootstrap/Container";
import TableComponent from "./TableComponent";
import { Box } from "@mui/material";
import BreadcrumbsComponent from "./BreadcrumbsComponent";
const StaticListComponent = ({
  bData,
  appData,
  columns,
  records,
  MasterPageName,
  isSearchRequired,
  ...rest
}) => {
  return (
    <>
      <Container fluid className="base-container">
        
        <Box
          sx={{
            width: 1,
            height: 80,
          }}
        >
          <h3 className="ms-4 mt-2">{MasterPageName}</h3>
          <div className="ms-4">
            <BreadcrumbsComponent bData={bData}></BreadcrumbsComponent>
          </div>
        </Box>
        <TableComponent
          columns={columns}
          data={records}
          title={MasterPageName}
          isSearchRequired={isSearchRequired}
          {...rest}
        />
      </Container>
    </>
  );
};

export default StaticListComponent;
