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
  const requiredMessage = "field is a required";
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
          <h3>Attendance Report</h3>
          <Card className="mt-1 border border-danger" style={{ width: "100%" }}>
            <Card.Body>
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
                      setValue={setFromdate}
                      max={(todate ?? "") == "" ? undefined : todate}
                    />
                  </Col>
                  <Col className="col-md-3">
                    <FormInputText
                      label="To Date"
                      name="ToDate"
                      type="date"
                      setValue={setTodate}
                      min={(fromdate ?? "") == "" ? undefined : fromdate}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col md={4}>
                    <FormInputDropdown
                      name="EmployeeId"
                      ddOpt={persons ?? []}
                      label="Person"
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <Button
                      id="btnRunReport"
                      variant="outline-primary"
                      type="submit"
                    >
                      Run Report
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
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
  return (
    <>
      <Container
        fluid
        className="p-4"
        style={{
          backgroundColor: "#FFF",
          borderRadius: "10px ",
          margin: "10px",
        }}
      >
        {filterComponent}
        {reportResultComponent}
      </Container>
    </>
  );
};

export default AttendanceReport;
