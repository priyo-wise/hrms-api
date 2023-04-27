import FilePresentIcon from "@mui/icons-material/FilePresent";
import React, { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/Button";
import { Form, FormInputDropdown, FormInputText } from "../Form";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import * as yup from "yup";
import { WebService } from "../../Services/WebService";
import { useDispatch } from "react-redux";
import { DateTime } from "luxon";
import _, { sortBy } from "underscore";
import TableComponent from "../../Services/TableComponent";
import { ActionPermission, PageInfo } from "../PageInfo";
import { Box, IconButton, Toolbar, Tooltip } from "@mui/material";
import { StandardConst } from "../../Services/StandardConst";
import BreadcrumbsComponent from "../../Services/BreadcrumbsComponent";

const TimesheetReport = () => {
  PageInfo({ pageTitle: "Detailed Time Report" });
  const roundOf = (num, position) => {
    return (
      Math.round((num + Number.EPSILON) * Math.pow(10, position)) /
      Math.pow(10, 2)
    );
  };
  const [filter, setFilter] = useState({
    FromDate: DateTime.local().toFormat("yyyy-MM-dd"),
    ToDate: DateTime.local().toFormat("yyyy-MM-dd"),
  });
  const [data, setData] = useState(null);
  const [fromdate, setFromdate] = useState(null);
  const [todate, setTodate] = useState(null);
  const [projects, setProjects] = useState([{ value: 0, text: "All" }]);
  const [tasks, setTasks] = useState([{ value: 0, text: "All" }]);
  const [persons, setPersons] = useState([{ value: 0, text: "All" }]);
  const renderAfterCalled = useRef(false);
  const dispatch = useDispatch();
  const fetchProjectList = async () => {
    var opt = { endPoint: "Project/Team", dispatch };
    if (permission.ManageSearchAllUsers)
      opt.endPoint = "CommonUtility/projectmaster?select=ProjectId,ProjectName";
    const res = await WebService(opt).then((c) =>
      sortBy(c ?? [], (s) => s.ProjectName)
    );
    setProjects((projects) =>
      [...projects].concat(
        (res ?? []).map((m) => {
          return {
            value: m.ProjectId,
            text: m.ProjectName,
          };
        })
      )
    );
  };
  const fetchTaskList = async () => {
    const res = await WebService({
      endPoint:
        "CommonUtility/taskcategorymaster?select=TaskCategoryId,TaskCategoryName",
      dispatch,
    }).then((c) =>
      sortBy(c ?? [], (s) => s.TaskCategoryName).map((m) => {
        return {
          value: m.TaskCategoryId,
          text: m.TaskCategoryName,
        };
      })
    );
    setTasks([...tasks].concat(res));
  };
  const fetchPersonList = async () => {
    var opt = { endPoint: "Project/Team/Member/Under", dispatch };
    if (permission.ManageSearchAllUsers)
      opt.endPoint =
        "CommonUtility/employees?select=EmployeeId,FullName&where=StatusId eq 3";
    const res = await WebService(opt).then((r) =>
      sortBy(r ?? [], (f) => f.FullName)
    );
    setPersons((persons) =>
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
  const [permission, _] = useState({
    ManageSearchAllUsers: ActionPermission(
      "TimeSheet Report - Search All Users"
    ),
    ManageReportingUser: ActionPermission("TimeSheet Report - Reporting User"),
  });
  const init = () => {
    fetchProjectList();
    fetchTaskList();
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
    var condition = `(Date between '${rec.FromDate}' and '${
      rec.ToDate
    }') and EmployeeId in (${
      rec.EmployeeId == 0
        ? persons
            .filter((f) => f.value != 0)
            .reduce((m, v) => `${m},${v.value}`, "")
            .substring(1)
        : rec.EmployeeId
    }) and ProjectId in (${
      rec.ProjectId == 0
        ? projects
            .filter((f) => f.value != 0)
            .reduce((m, v) => `${m},${v.value}`, "")
            .substring(1)
        : rec.ProjectId
    }) and TaskCategoryId in (${
      rec.TaskId == 0
        ? tasks
            .filter((f) => f.value != 0)
            .reduce((m, v) => `${m},${v.value}`, "")
            .substring(1)
        : rec.TaskId
    })`;
    const res = await WebService({
      endPoint: `TimeSheet/Report?where=${condition}`,
      dispatch,
    });
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
      Text: "Date",
      DateFormat: "yyyy-MM-dd",
      NotUseInExport: false,
      IsGroupByFeature: true,
    },
    {
      Text: "Project",
      Value: "ProjectName",
      IsGroupByFeature: true,
    },
    {
      Text: "Task",
      Value: "TaskCategoryName",
      IsGroupByFeature: true,
    },
    {
      Text: "Person",
      Value: "FullName",
      IsGroupByFeature: true,
    },
    {
      Text: "Details",
    },
    {
      Text: "Hours",
      style: { width: "100px", "text-align": "right" },
      Value: "TimeInHour",
      GroupByResult: "Summation",
    },
    {
      Text: "",
      NotUseInExport: true,
      style: { width: "25px", padding: "0px" },
      render: (dr) => (
        <>
          <Tooltip title="Attachment">
            <IconButton
              disabled={(dr?.Attachment ?? "") == ""}
              size="small"
              color="primary"
              aria-label="attachment"
              component="label"
              onClick={() => {
                window.open(
                  `${StandardConst.apiBaseUrl}/uploads/${dr.Attachment}`,
                  "_blank"
                );
              }}
            >
              <FilePresentIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];
  useEffect(() => {
    setFromdate(filter.FromDate);
  }, [filter.FromDate]);
  useEffect(() => {
    setTodate(filter.ToDate);
  }, [filter.ToDate]);
  const MasterPageName = "Time Sheet Report";
  const [bData, setBData] = React.useState([
    {
      title: "Time Sheet",
      hrefLink: "#",
    },
    {
      title: "Report",
      hrefLink: "#",
    },
  ]);

  const filterComponent = (
    <>
      {data === null && (
        <div style={{ backgroundColor: "#1976D2" }} className="pt-4 px-4">
          <Form
            defaultValues={filter}
            onSubmit={onSubmit}
            validationSchema={schema}
          >
            <Row>
              <Col className="col-md-4">
                <FormInputText
                  label="From Date"
                  name="FromDate"
                  type="date"
                  labelCss="text-light"
                  setValue={setFromdate}
                  max={(todate ?? "") == "" ? undefined : todate}
                />
              </Col>
              <Col className="col-md-4">
                <FormInputText
                  label="To Date"
                  name="ToDate"
                  labelCss="text-light"
                  type="date"
                  setValue={setTodate}
                  min={(fromdate ?? "") == "" ? undefined : fromdate}
                />
              </Col>
              {persons.length > 2 && (
                <Col md={4}>
                  <FormInputDropdown
                    name="EmployeeId"
                    labelCss="text-light"
                    ddOpt={persons ?? []}
                    label="Person"
                  />
                </Col>
              )}
            </Row>
            <Row>
              <Col md={4} className="py-0">
                <FormInputDropdown
                  name="ProjectId"
                  labelCss="text-light"
                  ddOpt={projects ?? []}
                  label="Project"
                />
              </Col>
              <Col md={4} className="py-0">
                <FormInputDropdown
                  name="TaskId"
                  labelCss="text-light"
                  ddOpt={tasks ?? []}
                  label="Task"
                />
              </Col>
              <Col md={4} className="py-0">
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
      )}
    </>
  );
  const reportResultComponent = (
    <>
      {data !== null && (
        <div>
          <div style={{ backgroundColor: "#1976D2" }} className="p-4">
            <Row>
              <Col>
                <div className="float-start">
                  <span className="h4 me-2 text-light">
                    Detailed Time Report:
                  </span>
                  <span className="h5 text-light">
                    {filter.FromDate}
                    {" — "}
                    {filter.ToDate}
                  </span>
                </div>
                <div className="float-end">
                  <Button
                    id="btnTimesheetFilter"
                    variant="outline-light"
                    onClick={filterChange}
                  >
                    Change Filters
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
          <div className="px-4 py-2">
            <Row>
              <Col>
                <div>
                  <span className="h6">Total hours: </span>{" "}
                  <span className="font-bold">
                    {data.reduce((m, c) => roundOf(m + c.TimeInHour, 2), 0)}
                  </span>
                </div>
              </Col>
              <Col>
                <div>
                  <span className="col-md-3 font-bold me-2">Project:</span>
                  <span className="col-md-9 font-bold">
                    {filter.ProjectId == 0
                      ? "All projects"
                      : projects.filter((f) => f.value == filter.ProjectId)[0]
                          .text}
                  </span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div>
                  <span className="col-md-3 font-bold me-2">Task:</span>
                  <span className="col-md-9 font-bold">
                    {filter.TaskId == 0
                      ? "All tasks"
                      : tasks.filter((f) => f.value == filter.TaskId)[0].text}
                  </span>
                </div>
              </Col>
              {persons.length > 2 && (
                <Col>
                  <div>
                    {" "}
                    <span className="col-md-3 font-bold me-2">Team:</span>
                    <span className="col-md-9 font-bold">
                      {filter.EmployeeId == 0
                        ? "Everyone"
                        : persons.filter((f) => f.value == filter.EmployeeId)[0]
                            .text}
                    </span>
                  </div>
                </Col>
              )}
            </Row>
          </div>
          <TableComponent
            columns={columns}
            data={data}
            IsAddButtonVisible={false}
            excelExportFileName={"TimeSheet"}
          />
        </div>
      )}
    </>
  );
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

export default TimesheetReport;
