import React from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "../../Static/Static.css";
import EmployeeFinance from "./EmployeeFinance";
import EmployeeSalaryTemplate from "./EmployeeSalaryTemplate";
import EmployeePackageDetails from "./EmployeePackageDetails";

const PayslipTemplate = () => {
  return (
    <>
      <Container
        className="p-4"
        style={{
          "background-color": "#FFF",
          "border-radius": "10px ",
          margin: "10px",
        }}
      >
        <Row>
          <Tabs
            defaultActiveKey="Employee Finance"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="Employee Finance" title=" Employee Finance ">
              <EmployeeFinance />
            </Tab>

            <Tab
              eventKey="Employee Salary Template"
              title=" Employee Salary Template "
            >
              <EmployeeSalaryTemplate />
            </Tab>
            <Tab
              eventKey="Employee Package Details"
              title=" Employee Package Details "
            >
              <EmployeePackageDetails />
            </Tab>
          </Tabs>
        </Row>
      </Container>
    </>
  );
};

export default PayslipTemplate;
