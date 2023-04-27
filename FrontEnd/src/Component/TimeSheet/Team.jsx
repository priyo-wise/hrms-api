import React, { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import { InputDropdown, InputText } from "../Form";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { WebService } from "../../Services/WebService";
import { useDispatch } from "react-redux";
import { DateTime } from "luxon";
import _, { extend, findWhere, groupBy, map, omit, reduce } from "underscore";
import TableComponent from "../../Services/TableComponent";
import { ActionPermission, PageInfo } from "../PageInfo";
import TopbarComponent from "../../Services/TopbarComponent";
import { Alert, Paper } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const TeamComponent = () => {
  PageInfo({ pageTitle: "Team Members" });
  var dispatch = useDispatch();
  const roundOf = (num, position) => {
    return (
      Math.round((num + Number.EPSILON) * Math.pow(10, position)) /
      Math.pow(10, 2)
    );
  };
  const [filter, setFilter] = useState({
    FromDate: DateTime.local().toFormat("yyyy-MM-dd"),
    ToDate: DateTime.local().toFormat("yyyy-MM-dd"),
    team: 0,
  });
  const [teams, setTeams] = useState([]);
  const [reports, setReports] = useState([]);
  const afterRender = useRef(false);
  useEffect(() => {
    if (!afterRender.current) {
      fetchDesignation();
    }
    afterRender.current = true;
  }, []);
  const fetchDesignation = async () => {
    const v1 = await WebService({
      dispatch,
      endPoint:
        "CommonUtility/static_project_roles?orderBy=DisplayDescription&select=DisplayDescription,ProjectRoleId",
    });
    setTeams(
      [{ value: 0, text: "Everyone" }].concat(
        map(v1, (m) => ({ value: m.ProjectRoleId, text: m.DisplayDescription }))
      )
    );
  };
  const fetchReport = async (search = filter) => {
    const team =
      search.team != 0
        ? `'${search.team}'`
        : teams
            .filter((f) => f.value != 0)
            .reduce((m, v) => `${m},'${v.value}'`, "")
            .substring(1);
    if (teams.length > 0) {
      const endPoint = `CommonUtility/timesheet?where=(Date between '${search.FromDate}' and '${filter.ToDate}') and RoleId in (${team})&expand=employees, taskcategorymaster&select=sum(TimeInHour) TimeInHour, employees.EmployeeId, employees.Designation, employees.FullName, taskcategorymaster.TaskTypeId&groupBy=employees.EmployeeId, employees.Designation, employees.FullName, taskcategorymaster.TaskTypeId`;
      setReports(
        await WebService({ dispatch, endPoint }).then((c) =>
          map(groupBy(c, ["EmployeeId"]), (val, key) =>
            extend(omit(val[0], ["TimeInHour", "TaskTypeId"]), {
              TimeInHour: roundOf(
                reduce(val, (m, val1) => m + val1.TimeInHour, 0),
                2
              ),
              Billable: findWhere(val, { TaskTypeId: 1 })?.TimeInHour ?? 0,
              NonBillable: findWhere(val, { TaskTypeId: 2 })?.TimeInHour ?? 0,
            })
          )
        )
      );
    }
  };
  useEffect(() => {
    if (
      (filter.FromDate ?? "").toString().length > 0 &&
      (filter.ToDate ?? "").toString().length > 0 &&
      teams.length > 0
    ) {
      fetchReport();
    }
  }, [filter, teams]);
  var filterableViewComponent = (
    <>
      <Row className="px-4 pt-2">
        <Col md={1}>
          <span>From</span>
        </Col>
        <Col md={3}>
          <InputText
            type="date"
            value={filter.FromDate}
            setValue={(v) => setFilter({ ...filter, FromDate: v })}
            max={(filter.ToDate ?? "") == "" ? undefined : filter.ToDate}
          />
        </Col>
        <Col md={1}>
          <span>To</span>
        </Col>{" "}
        <Col md={3}>
          <InputText
            type="date"
            value={filter.ToDate}
            setValue={(v) => setFilter({ ...filter, ToDate: v })}
            min={(filter.FromDate ?? "") == "" ? undefined : filter.FromDate}
          />
        </Col>
        <Col>&nbsp;</Col>
        <Col md={3}>
          <InputDropdown
            className="form-control"
            ddOpt={teams || []}
            value={filter.team}
            setValue={(v) => setFilter({ ...filter, team: v })}
          />
        </Col>
      </Row>
    </>
  );
  var reportSummaryComponent = (
    <>
      <Row className="px-4">
        <Col>
          Total Hours:{" "}
          {roundOf(
            reduce(reports, (m, v) => m + v.TimeInHour, 0),
            2
          )}
        </Col>
        <Col>
          Billable Hours:{" "}
          {roundOf(
            reduce(reports, (m, v) => m + v.Billable, 0),
            2
          )}
        </Col>
        <Col>
          Non-Billable Hours:{" "}
          {roundOf(
            reduce(reports, (m, v) => m + v.NonBillable, 0),
            2
          )}
        </Col>
      </Row>
    </>
  );
  var reportInGridComponent = (
    <>
      <Row>
        <Col>
          <TableComponent
            data={reports}
            columns={[
              { Text: "Member", Value: "FullName" },
              { Text: "Hours", Value: "TimeInHour" },
              { Text: "Billable hours", Value: "Billable" },
              { Text: "Non-Billable hours", Value: "NonBillable" },
            ]}
            IsAddButtonVisible={false}
          ></TableComponent>
        </Col>
      </Row>
    </>
  );
  const [bData, setBData] = React.useState([
    {
      title: "Timesheet",
      hrefLink: "#",
    },
    {
      title: "Team",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Team";
  return (
    <>
      <Container fluid className="base-container">
        <TopbarComponent bData={bData} HeadingText={MasterPageName} />

        <Paper elevation={0} className="mb-3">
          <Alert severity="info" icon={<FilterAltIcon />}>
            <strong>Filter Team</strong>
          </Alert>
          {filterableViewComponent}
        </Paper>

        <hr></hr>
        {reportSummaryComponent}
        <hr></hr>
        {reportInGridComponent}
      </Container>
    </>
  );
};

export default TeamComponent;
