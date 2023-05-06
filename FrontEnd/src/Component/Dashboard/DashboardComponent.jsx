/* #region Import */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { WebService } from "../../Services/WebService";
import { format } from "date-fns";
import "./Dashboard.css";
import AddEditLeave from "../Leave/AddEditleave";
import { toInteger } from "lodash";
import StarRatings from "react-star-ratings";
import { Link } from "react-router-dom";
import _, { reduce } from "underscore";
import { DateTime } from "luxon";
import { PageInfo } from "../PageInfo";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { StandardConst } from "../../Services/StandardConst";
import {
  AlertTitle,
  Avatar,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { Alert } from "@mui/material";
import Swal from "sweetalert2";
import { InputText } from "../Form";
import { contentSearch, dataClone } from "../../Services/UtilityService";
import BarGraph from "../../Services/BarGraphComponent";
/* #endregion */

const DashboardComponent = () => {
  PageInfo({ pageTitle: "Dashboard" });
  var ActiveClass = null;
  const [Info, setInfo] = useState([]);
  const [Performance, setPerformance] = useState([]);
  const [leaveStatus, setleaveStatus] = useState([]);
  const [Employeeleave, setEmployeeleave] = useState([]);
  const [EmployeeProject, setEmployeeProject] = useState([]);
  const [ProjectManager, setProjectManager] = useState([]);
  const [Notification, setNotification] = useState([]);
  const [timeSheet, setTimeSheet] = useState({});
  var dispatch = useDispatch();
  var fetchData = async () => {
    var res = await WebService({ endPoint: "Dashboard/Fetch", dispatch });
    //setDashboard(res.users);
    if (res.rating[0] == null) {
      setPerformance(0);
    } else {
      setPerformance(res.rating[0]);
    }
    // if ((res.EmployeeAssignProject[0]?.CreatedDate || "") !== "")
    //     res.EmployeeAssignProject[0].CreatedDate = format(
    //       new Date(res.EmployeeAssignProject[0].CreatedDate),
    //       "yyyy-MM-dd"
    //     );

    setleaveStatus(res.lastleaveStatus[0]?.Status);
    setEmployeeleave(res.Employeeleave);
    setEmployeeProject(res.EmployeeAssignProject);
    setProjectManager(res.ProjectManager);
    let pendingFor = 0;
    if (
      res.timeSheet.lastDay.length > 0 &&
      DateTime.fromISO(res.timeSheet.lastDay[0].LastDate).diffNow("day").values
        .days < -1
    ) {
      pendingFor =
        parseInt(
          DateTime.fromISO(res.timeSheet.lastDay[0].LastDate).diffNow("day")
            .values.days
        ) * -1;
    }
    let lastEntryTime = 0;
    let lastEntryProject = "N/A";
    if (res.timeSheet.lastEntry.length > 0) {
      const lastEntry = res.timeSheet.lastEntry[0];
      lastEntryProject = lastEntry.ProjectName;
      lastEntryTime = parseInt(
        DateTime.fromISO(lastEntry.UpdatedTime).diffNow("day").values.days * -1
      );
    }
    setTimeSheet({
      pendingFor: `${pendingFor} Days`,
      lastEntryTime: `${lastEntryTime} Days`,
      lastEntryProject,
    });
  };
  const fetchNotification = async () => {
    var res = await WebService({ endPoint: "Notification/Fetch", dispatch });
    setNotification(res);
  };
  const handleSweetAlert = () => {
    Swal.fire({
      title: "Success",
      text: "Successfully Checked In",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const fetchCheckIn = async () => {
    var info = await WebService({
      endPoint: "Dashboard/fetchCheckIn",
      method: "GET",
      dispatch,
    });
    setInfo(info?.slice(-1) ?? []);
  };
  const addEditModalRef = useRef();
  const fnEdit = async (id) => await addEditModalRef.current.openModal(id || 0);
  const renderAfterCalled = useRef(false);
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchData();
      fetchCheckIn();
      fetchNotification();
    }
    renderAfterCalled.current = true;
  }, []);
  const pStatuscolor = leaveStatus == "Pending";
  const aStatuscolor = leaveStatus == "Approve";
  const rStatuscolor = leaveStatus == "Reject";
  const score = toInteger(
    (Performance.ManagerScore +
      Performance.EmpSelfScore +
      Performance.FinalAgreedScore) /
      3
  );

  function randomColor() {
    let hex = Math.floor(Math.random() * 0xffffff);
    let color = "#" + hex.toString(16);

    return color;
  }

  const checkIn = async () => {
    const res = await WebService({
      endPoint: "Dashboard/Submit",
      method: "POST",
      dispatch,
    });
    if (res.Message == "Success") {
      handleSweetAlert();
    }
    fetchCheckIn();
  };

  var Checked =
    Info?.length == 0 ? (
      <button
        className="btn d-inline-flex btn-sm btn-success mx-1"
        onClick={checkIn}
      >
        <span className=" mx-1">
          <i className="fa fa-clock-o"></i>
        </span>
        Check In
      </button>
    ) : Info[0]?.CheckOutTime == null && Info?.length > 0 ? (
      <button
        className="btn d-inline-flex btn-sm btn-success mx-1"
        onClick={checkIn}
      >
        <span className=" mx-1">
          <i className="fa fa-clock-o"></i>
        </span>
        Check Out
      </button>
    ) : (
      <button
        className="btn d-inline-flex btn-sm btn-success mx-1"
        onClick={checkIn}
      >
        <span className=" mx-1">
          <i className="fa fa-clock-o"></i>
        </span>
        Check In
      </button>
    );

  return (
    <div className="container p-0">
      <header className="bg-surface-primary border-bottom pt-6 p-2">
        <div className="container-fluid p-2">
          <div className="mb-npx">
            <div className="row align-items-center p-0">
              <div className="col-sm-6 col-12 mb-4 mb-sm-0">
                <h3 className="ms-4 mt-2">Dashboard</h3>
              </div>

              <div className="col-sm-6 col-12 text-sm-end">
                <div className="mx-n1">
                  {Checked}
                  <a
                    id="btnHeaderEditProfile"
                    href="#"
                    className="btn d-inline-flex btn-sm btn-info mx-1"
                  >
                    <span className=" pe-2">
                      <i className="fa fa-pencil"></i>
                    </span>
                    <span>
                      <Link to="/Common/Profile">Edit Profile </Link>{" "}
                    </span>
                  </a>
                  <a
                    href="#"
                    id="btnHeaderLeaveApply"
                    onClick={() => fnEdit()}
                    className="btn d-inline-flex btn-sm btn-primary mx-1"
                  >
                    <span className=" pe-2">
                      <i className="fa fa-plus"></i>
                    </span>
                    <span>Applied Leave</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <TeamDashboard />
      {/* <TopPerformers /> */}
      <div className="base-margin-x">
        <Row>
          <Col className="col-md-6">
            {" "}
            <Paper>
              <Alert severity="info" icon={<AccountTreeIcon />}>
                <strong> Project Details</strong>
              </Alert>
              {EmployeeProject.length == 0
                ? "No Project Assigned yet"
                : EmployeeProject.map((data) => {
                    return (
                      <div className="d-flex justify-content-between">
                        <List
                          sx={{ width: "100%", bgcolor: "background.paper" }}
                        >
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar
                                style={{
                                  backgroundColor: randomColor(),
                                }}
                                alt={`${data.ProjectName}`}
                                src="/static/images/avatar/1.jpg"
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={`${data.ProjectName} `}
                              secondary={
                                <React.Fragment>
                                  <Typography
                                    sx={{ display: "inline" }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    Manager:
                                  </Typography>
                                  {ProjectManager.map((managerData) => {
                                        return (
                                          <span>
                                            {" "}
                                            {data.ProjectId ==
                                            managerData.ProjectId
                                              ? managerData.FullName
                                              : ""}{" "}
                                          </span>
                                        );
                                      })}
                                  <span className="d-flex float-end">
                                    <Typography
                                      sx={{ display: "inline" }}
                                      component="span"
                                      variant="body2"
                                      color="text.primary"
                                    >
                                      Assigned On:
                                    </Typography>

                                    {format(
                                      new Date(data.CreatedDate),
                                      "dd-MMM-yy"
                                    )}
                                  </span>
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </List>
                      </div>
                    );
                  })}
            </Paper>
          </Col>
          <Col className="col-md-6">
            {" "}
            <Paper>
              <Alert severity="success" icon={<NotificationsActiveIcon />}>
                <strong> Notification</strong>
              </Alert>
              {Notification.length == 0
                ? "No Notification"
                : Notification.map((note) => {
                    return (
                      <div className="d-flex justify-content-between">
                        <List
                          sx={{ width: "100%", bgcolor: "background.paper" }}
                        >
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar
                                alt={`${note.Title}`}
                                src="/static/images/avatar/1.jpg"
                              />
                            </ListItemAvatar>
                            <Link to={note.Route}>
                              <ListItemText
                                primary={`${note.Title} `}
                                secondary={
                                  <React.Fragment>
                                    <Typography
                                      sx={{ display: "inline" }}
                                      component="span"
                                      variant="body2"
                                      color="text.primary"
                                    ></Typography>
                                    {Notification.length == 0 ? (
                                      "No Notification"
                                    ) : (
                                      <span> {note.Subject} </span>
                                    )}
                                  </React.Fragment>
                                }
                              />
                            </Link>
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </List>
                      </div>
                    );
                  })}
            </Paper>
          </Col>
        </Row>
      </div>
      <div>
        <div className="base-margin-x base-margin-2y">
          <div className="d-style btn btn-brc-tp border-2 bgc-white btn-outline-blue btn-h-outline-blue btn-a-outline-blue w-100 base-margin-2y py-3 shadow-sm">
            <div className="row align-items-center">
              <div className="col-12 col-md-4">
                <h4 className="pt-3 text-170 text-600 text-primary-d1 letter-spacing">
                  Leave Details
                </h4>

                <div className="text-secondary-d1 text-120">
                  <span className="ml-n15 align-text-bottom">Status: </span>
                  {pStatuscolor ? (
                    <span className="badge bg-warning">{leaveStatus}</span>
                  ) : aStatuscolor ? (
                    <span className="badge bg-success">{leaveStatus}</span>
                  ) : rStatuscolor ? (
                    <span className="badge bg-danger">{leaveStatus}</span>
                  ) : (
                    <span className="badge bg-dark">No leave Applied Yet</span>
                  )}
                </div>
              </div>
              <ul className="list-unstyled mb-0 col-12 col-md-4 text-dark-l1 text-90 text-left  my-md-0">
                {Employeeleave.length == 0
                  ? "No leave allocated yet"
                  : Employeeleave.map((data) => {
                      return (
                        <li>
                          <i className="fa fa-check text-success text-110 mr-2 mt-1"></i>
                          <span>
                            <span className="text-110">
                              {" "}
                              {data.LeaveName} :{data.Usedleave}/{data.Balance}
                            </span>
                          </span>
                        </li>
                      );
                    })}
              </ul>
              <div className="col-12 col-md-4 text-center">
                <Link
                  to="/AllApplyleavelist"
                  id="btnApplyleavelink"
                  className="f-n-hover btn btn-info btn-raised px-4 py-25 w-75 text-600"
                >
                  Applied Leave
                </Link>
              </div>
            </div>
          </div>

          <div className="d-style bgc-white btn btn-brc-tp btn-outline-green btn-h-outline-green btn-a-outline-green w-100 base-margin-2y py-3 shadow-sm border-2">
            <div className="row align-items-center">
              <div className="col-12 col-md-4">
                <h4 className="pt-3 text-170 text-600 text-green-d1 letter-spacing">
                  Time Sheet
                </h4>

                <div className="text-secondary-d2 text-120">
                  <span className="badge rounded-pill bg-danger">Pending</span>
                </div>
              </div>

              <ul className="list-unstyled mb-0 col-12 col-md-4 text-dark-l1 text-90 text-left my-md-0">
                <li>
                  <i className="fa fa-check text-danger text-110 mr-2 mt-1"></i>
                  <span>
                    <span className="text-110">
                      {" "}
                      Pending for : {timeSheet.pendingFor}
                    </span>
                  </span>
                </li>
                <li>
                  <i className="fa fa-check text-success text-110 mr-2 mt-1"></i>
                  <span>
                    <span className="text-110">
                      {" "}
                      Last Entry : {timeSheet.lastEntryTime} ago
                    </span>
                  </span>
                </li>
                <li>
                  <i className="fa fa-check text-success text-110 mr-2 mt-1"></i>
                  <span>
                    <span className="text-110">
                      {" "}
                      Last Entry : {timeSheet.lastEntryProject}
                    </span>
                  </span>
                </li>
              </ul>

              <div className="col-12 col-md-4 text-center">
                <Link
                  to="/TimeSheet/Entry"
                  id="btnComplateTimesheetlink"
                  className="f-n-hover btn btn-success btn-raised px-4 py-25 w-75 text-600"
                >
                  Complete Timesheet
                </Link>
              </div>
            </div>
          </div>

          <div className="d-style btn btn-brc-tp border-2 bgc-white btn-outline-purple btn-h-outline-purple btn-a-outline-purple w-100 base-margin-2y py-3 shadow-sm">
            {" "}
            <div className="row align-items-center">
              <div className="col-12 col-md-4">
                <h4 className="pt-3 text-170 text-600 text-purple-d1 letter-spacing">
                  Self Performance
                </h4>
                <div className="d-flex justify-content-center">
                  <div className="ratings">
                    <StarRatings
                      rating={score}
                      starDimension="25px"
                      starSpacing="5px"
                      starRatedColor="#ffc107"
                    />
                  </div>
                </div>
              </div>

              <ul className="list-unstyled mb-0 col-12 col-md-4 text-dark-l1 text-90 text-left my-md-0">
                {" "}
                <li
                  {...(ActiveClass = [
                    Performance.ManagerScore <= "3"
                      ? "fa fa-check text-danger text-110 mr-2 mt-1"
                      : Performance.ManagerScore == 4
                      ? "fa fa-check text-info text-110 mr-2 mt-1"
                      : "fa fa-check text-success text-110 mr-2 mt-1",
                  ].join(""))}
                >
                  <i className={ActiveClass}></i>
                  <span>
                    <span className="text-110">
                      {" "}
                      Manager Score :{" "}
                      {Performance.ManagerScore > 0
                        ? Performance.ManagerScore
                        : "No Rating"}
                    </span>
                  </span>
                </li>
                <li
                  {...(ActiveClass = [
                    Performance.EmpSelfScore == "3"
                      ? "fa fa-check text-danger text-110 mr-2 mt-1"
                      : Performance.EmpSelfScore == "4"
                      ? "fa fa-check text-info text-110 mr-2 mt-1"
                      : "fa fa-check text-success text-110 mr-2 mt-1",
                  ])}
                >
                  <i className={ActiveClass}></i>
                  <span>
                    <span className="text-110">
                      {" "}
                      Self Score :{" "}
                      {Performance.EmpSelfScore > 0
                        ? Performance.EmpSelfScore
                        : "No Rating"}
                    </span>
                  </span>
                </li>
                <li
                  {...(ActiveClass = [
                    Performance.FinalAgreedScore == "3"
                      ? "fa fa-check text-danger text-110 mr-2 mt-1"
                      : Performance.FinalAgreedScore == "4"
                      ? "fa fa-check text-info text-110 mr-2 mt-1"
                      : "fa fa-check text-success text-110 mr-2 mt-1",
                  ])}
                >
                  <i className={ActiveClass}></i>
                  <span>
                    <span className="text-110">
                      {" "}
                      Final Score :{" "}
                      {Performance.FinalAgreedScore > 0
                        ? Performance.FinalAgreedScore
                        : "No Rating"}
                    </span>
                  </span>
                </li>
              </ul>

              <div className="col-12 col-md-4 text-center">
                <Link
                  to="/Performance"
                  id="btnViewReportlink"
                  className="f-n-hover btn btn-warning btn-raised px-4 py-25 w-75 text-600"
                >
                  View Report
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddEditLeave
        callBackEvent={() => fetchData()}
        ref={addEditModalRef}
      ></AddEditLeave>
    </div>
  );
};
const TeamDashboard = () => {
  var ActiveClass = null;
  const [Dashboard, setDashboard] = useState([]);
  const [pg, setpg] = React.useState(0);
  const [rpg, setrpg] = React.useState(3);
  const afterRender = React.useRef(false);
  const dispatch = useDispatch();
  const fetchData = async (searchText) => {
    searchText ??= "";
    const v1 = await WebService({
      dispatch,
      endPoint: `Project/Team/Member?search=${searchText}`,
    });
    setDashboard(v1);
  };
  function handleChangePage(event, newpage) {
    setpg(newpage);
  }
  function handleChangeRowsPerPage(event) {
    setrpg(parseInt(event.target.value, 10));
    setpg(0);
  }
  React.useEffect(() => {
    if (!afterRender.current) fetchData();
    afterRender.current = true;
  }, []);
  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  }));
  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  // const InputText = styled(InputBase)(({ theme }) => ({
  //   color: "inherit",
  //   "& .MuiInputBase-input": {
  //     padding: theme.spacing(1, 1, 1, 0),
  //     // vertical padding + font size from searchIcon
  //     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  //     transition: theme.transitions.create("width"),
  //     width: "100%",
  //     [theme.breakpoints.up("md")]: {
  //       width: "20ch",
  //     },
  //   },
  // }));
  return (
    <>
      <div className="base-margin-x mt-2 base-margin-2y mb-2">
        <Paper>
          <Alert
            severity="info"
            icon={<Diversity3Icon />}
            action={
              <div className="d-flex flex-row align-self-center">
                <InputText
                  setValue={async (v) => await fetchData(v ?? "")}
                  placeholder="Search Team"
                />
                {/* <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <InputText
                    value={searchText}
                    setValue={(v) => setSearchText(v ?? "")}
                    placeholder="Search Team"
                  />
                </Search> */}
              </div>
            }
          >
            <AlertTitle>My Team</AlertTitle>
          </Alert>

          <div className="d-flex flex-row mx-2">
            {Dashboard.slice(pg * rpg, pg * rpg + rpg).map((item) => (
              <div className="col-md-4 col-sm-4 col-12 p-1">
                <div className="d-none">
                  {
                    (ActiveClass = [
                      item.Status == "Approve" ? "success" : "warning",
                    ].join(" "))
                  }
                </div>

                <div className="card card-team">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                          <img
                            className="rounded-circle"
                            src={`${StandardConst.apiBaseUrl}/uploads/${item.ProfileImage ?? "" }`}
                            style={{ width: "45px", height: "45px" }}
                            alt=""
                          />
                        {/* <img
                          src="https://mdbootstrap.com/img/new/avatars/8.jpg"
                          alt=""
                          style={{ width: "45px", height: "45px" }}
                          className="rounded-circle"
                        /> */}
                        <div className="ms-3">
                          <p className="fw-bold mb-1"> {item.FullName}</p>
                          {(item.Roles ?? []).length > 0 && (
                            <p className="text-muted mb-0">
                              {" "}
                              {reduce(
                                item.Roles,
                                (m, v) =>
                                  `${m}, ${v.ProjectName} (${v.DisplayDescription})`,
                                ""
                              ).substring(2)}
                            </p>
                          )}
                          {(item.Roles ?? []).length < 1 && (
                            <p className="text-muted mb-0">
                              {" "}
                              {item.Designation}
                            </p>
                          )}
                        </div>
                      </div>

                      <span
                        className={`bordered accent badge badge-pill bg-soft-${ActiveClass} text-${ActiveClass} me-2`}
                      >
                        {item.Status}
                      </span>
                    </div>
                  </div>
                  <div className="card-footer text-muted d-flex justify-content-around">
                    <button className="btn">
                      <a href={`mailto:${item.Email}`}>
                        <i className="fa fa-envelope"></i>
                      </a>
                    </button>
                    <button className="btn">
                      <a href={`tel:${item.Phone}`}>
                        <i className="fa fa-phone"></i>
                      </a>
                    </button>
                    <button className="btn">
                      <i className="fa fa-comments"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <TablePagination
            rowsPerPageOptions={[4]}
            component="div"
            count={Dashboard.length}
            rowsPerPage={rpg}
            page={pg}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </>
  );
};

const TopPerformers = () => {
  const afterRender = React.useRef(false);
  const dispatch = useDispatch();
  const [topPerformers, setTopPerformers] = React.useState({});
  React.useEffect(() => {
    if (!afterRender.current) fetchTopPerformers();
    afterRender.current = true;
  }, []);
  const fetchTopPerformers = async () => {
    var res = await WebService({
      endPoint: "Dashboard/fetchTopPerformers",
      dispatch,
    });
    setTopPerformers(res);
  };
  return (
    <>
      <div className="base-margin-x mt-2 base-margin-2y mb-2">
        <Paper>
          <Alert severity="success" icon={<NotificationsActiveIcon />}>
            <strong> Top Performers</strong>
          </Alert>
          <div className="d-flex flex-wrap justify-content-center">
            {topPerformers.map((p) => {
              return (
                <div class="card text-center card-performers mt-3 m-2">
                  <div class="circle-image">
                    <img src="https://i.imgur.com/hczKIze.jpg" width="50" />
                  </div>
                  {/* <div>
                    <Avatar
                      className="performance-image"
                      alt={`${p.argument}`}
                      src="/static/images/avatar/1.jpg"
                    />
                  </div> */}
                  <div class="six-pointed-star"></div>
                  <span class="name mb-1 fw-500">{p.argument}</span>
                  <small class="text-black-50">{p.Designation}</small>
                  <small class="text-black-50 font-weight-bold">
                    {p.EmployeeCode}
                  </small>
                  <div class="rate bg-success text-white mt-1">
                    <div class="rating">
                      <input type="radio" name="rating" value="5" id="5" />
                      <label for="5">★</label>
                      <input type="radio" name="rating" value="5" id="4" />
                      <label for="4">★</label>
                      <input type="radio" name="rating" value="5" id="3" />
                      <label for="3">★</label>
                      <input type="radio" name="rating" value="5" id="2" />
                      <label for="2">★</label>
                      <input type="radio" name="rating" value="5" id="1" />
                      <label for="1">★</label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Paper>
      </div>
    </>
  );
};

//   const fetchOwnPerformermence = async () => {
//     var res = await WebService({
//       endPoint: "Dashboard/fetchTopPerformers",
//       dispatch,
//     });
//     setTopPerformers(res);
//   };
//   return (
//     <>
//       <div className="base-margin-x mt-2 base-margin-2y mb-2">
//         <Paper>
//           <Alert severity="success" icon={<NotificationsActiveIcon />}>
//             <strong> Top Performers</strong>
//           </Alert>
//           {/* <BarGraph data={topPerformers} /> */}
//         </Paper>
//       </div>
//     </>
//   );
// };
export default DashboardComponent;
