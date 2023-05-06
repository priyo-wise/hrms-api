import React, { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Form, FormInputDropdown, FormInputText } from "../Form";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import * as yup from "yup";
import { WebService } from "../../Services/WebService";
import { useDispatch, useSelector } from "react-redux";
import { DateTime, Info } from "luxon";
import _ from "underscore";
import TableComponent from "../../Services/TableComponent";
import { ActionPermission, PageInfo } from "../PageInfo";
import { Box } from "@mui/material";
import BreadcrumbsComponent from "../../Services/BreadcrumbsComponent";
const AttendanceReport = () => {
  PageInfo({ pageTitle: "Attendance Report" });

  const [filter, setFilter] = useState({
    FromDate: DateTime.local().toFormat("yyyy-MM-dd"),
    ToDate: DateTime.local().toFormat("yyyy-MM-dd"),
  });
  const [data, setData] = useState(null);
  const [fromdate, setFromdate] = useState(null);
  const [todate, setTodate] = useState(null);
  const [persons, setPersons] = useState([{ value: 0, text: "All" }]);
  const renderAfterCalled = useRef(false);
  const dispatch = useDispatch();

  const fetchPersonList = async () => {
    var opt = { endPoint: "User/ActiveUserList", dispatch };
    // if (permission.ManageSearchAllUsers) opt.endPoint += "?user=all";
    // else if (permission.ManageReportingUser) opt.endPoint += "?user=manage";
    // else opt.endPoint += "?user=own";

    const res = await WebService(opt);
    setPersons(
      [...persons].concat(
        (res ?? []).map((m) => {
          return {
            value: m.EmployeeId,
            text: m.FullName,
          };
        })
      )
    );
  };
  //   const [permission, _] = useState({
  //     ManageSearchAllUsers: ActionPermission(
  //       "TimeSheet Report - Search All Users"
  //     ),
  //     ManageReportingUser: ActionPermission("TimeSheet Report - Reporting User"),
  //   });
  const init = () => {
    // fetchProjectList();
    // fetchTaskList();
    fetchPersonList();
  };
  useEffect(() => {
    if (!renderAfterCalled.current) {
      init();
    }
    renderAfterCalled.current = true;
  }, []);
  const onSubmit = async (rec) => {
    rec.ToDate = DateTime.fromJSDate(rec.ToDate).toSQLDate();
    rec.FromDate = DateTime.fromJSDate(rec.FromDate).toSQLDate();
    setFilter(rec);
    rec.EmployeeId ??= 0;
    var condition = `(CheckInDate between '${rec.FromDate}' and '${
      rec.ToDate
    }') and EmployeeId in (${
      rec.EmployeeId == 0
        ? persons
            .filter((f) => f.value != 0)
            .reduce((m, v) => `${m},${v.value}`, "")
            .substring(1)
        : rec.EmployeeId
    }) `;
    console.log(condition);
    const res = await WebService({
      endPoint: `Attendance/Report?where=${condition}`,
      dispatch,
    });
    console.log("res", res);
    setData(res);
  };
  const requiredMessage = "This is a required field";
  const schema = yup
    .object()
    .shape({
      FromDate: yup
        .date()
        .label("From Date")
        .typeError(requiredMessage)
        .required()
        .when([], (_, passSchema) => {
          return todate ?? "" != ""
            ? passSchema.max(DateTime.fromSQL(todate).toJSDate())
            : passSchema;
        }),

      ToDate: yup
        .date()
        .label("To Date")
        .typeError(requiredMessage)
        .required()
        .when([], (_, passSchema) => {
          return fromdate ?? "" != ""
            ? passSchema.min(DateTime.fromSQL(fromdate).toJSDate())
            : passSchema;
        }),
    })
    .required();
  const filterChange = () => {
    setData(null);
  };
  const columns = [
    {
      Text: "Check In Date",
      Value: "CheckInDate",
      DateFormat: "yyyy-MM-dd",
      IsGroupByFeature: true,
    },
    {
      Text: "Check In Time",
      Value: "CheckInTime",
      IsGroupByFeature: true,
    },
    {
      Text: "Check Out Time",
      Value: "CheckOutTime",
      IsGroupByFeature: true,
    },
    {
      Text: "Person",
      Value: "FullName",
      IsGroupByFeature: true,
    },
  ];
  useEffect(() => {
    setFromdate(filter.FromDate);
  }, [filter.FromDate]);
  useEffect(() => {
    setTodate(filter.ToDate);
  }, [filter.ToDate]);
  const filterComponent = (
    <>
      {data === null && (
        <div>
          <div style={{ backgroundColor: "#1976D2" }} className="pt-4 px-4">
            <Form
              defaultValues={filter}
              onSubmit={onSubmit}
              validationSchema={schema}
            >
              <Row>
                <Col className="col-md-3">
                  <FormInputText
                    label="From Date"
                    name="FromDate"
                    type="date"
                    labelCss="text-light"
                    setValue={setFromdate}
                    max={(todate ?? "") == "" ? undefined : todate}
                  />
                </Col>
                <Col className="col-md-3">
                  <FormInputText
                    label="To Date"
                    name="ToDate"
                    labelCss="text-light"
                    type="date"
                    setValue={setTodate}
                    min={(fromdate ?? "") == "" ? undefined : fromdate}
                  />
                </Col>
                <Col className="col-md-3">
                  <FormInputDropdown
                    name="EmployeeId"
                    ddOpt={persons ?? []}
                    label="Person"
                    labelCss="text-light"
                  />
                </Col>
                <Col className="col-md-3">
                  <Button
                    id="btnRunReport"
                    variant="outline-light"
                    type="submit"
                    className="float-end"
                  >
                    Run Report
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      )}
    </>
  );
  const reportResultComponent = (
    <>
      {data !== null && (
        <div>
          <Row>
            <Col>
              <div className="float-start">
                <span className="h3 me-2">Detailed Attendance Report :</span>
                <span className="h5">
                  {filter.FromDate}
                  {" — "}
                  {filter.ToDate}
                </span>
              </div>

              <div className="float-end">
                <Button
                  id="btnAttendanceFilter"
                  variant="outline-primary"
                  onClick={filterChange}
                >
                  Change Filters
                </Button>
              </div>
            </Col>
          </Row>
          <hr></hr>
          <div>
            <Row>
              <Col>
                <Row>
                  <Col className="col-md-3 font-bold">Team:</Col>
                  <Col className="col-md-9 font-bold">
                    {filter.EmployeeId == 0
                      ? "Everyone"
                      : persons.filter((f) => f.value == filter.EmployeeId)[0]
                          .text}
                  </Col>
                </Row>
              </Col>
            </Row>
            <TableComponent
              columns={columns}
              data={data}
              IsAddButtonVisible={false}
              excelExportFileName={"Attendance"}
            />
          </div>
        </div>
      )}
    </>
  );
  const MasterPageName = "Attendance Report";
  const [bData, setBData] = React.useState([
    {
      title: "Attendance Report",
      hrefLink: "#",
    },
    {
      title: "Report",
      hrefLink: "#",
    },
  ]);
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
        {filterComponent}
        {reportResultComponent}
      </Container>
    </>
  );
};

export default AttendanceReport;
