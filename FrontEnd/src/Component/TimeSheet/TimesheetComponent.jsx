import React, { useEffect, useState, useRef } from "react";
import FileIcon from "@mui/icons-material/FilePresentOutlined";
import uuid from "react-uuid";
import AddEditTimeSheet from "./AddEditTimesheet";
import { DateTime, Info } from "luxon";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { WebService } from "../../Services/WebService";
import { useDispatch } from "react-redux";
import { PageInfo } from "../PageInfo";
import { filter } from "underscore";
import TopbarComponent from "../../Services/TopbarComponent";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { StandardConst } from "../../Services/StandardConst";

const TimeSheetDateWiseSummary = (prop) => {
  const primary = "#1976D2";
  const renderAfterCalled = useRef(false);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const fetchTimeSheetSummaryList = async () => {
    const x1 = await WebService({
      endPoint: `TimeSheet/Fetch/Own/${prop.date}`,
      dispatch,
    });
    setData(x1);
    prop.TotalHour(x1.reduce((memo, val) => memo + val.TimeInHour, 0));
  };

  useEffect(() => {
    fetchTimeSheetSummaryList();
  }, [prop.guid]);
  const addEditModalRef = useRef();
  const fnEdit = async (id) => {
    var hour = filter(data, (f) => f.TimeSheetId != (id ?? 0)).reduce(
      (memo, val) => memo + val.TimeInHour,
      0
    );
    await addEditModalRef.current.openModal(id || 0, null, hour);
  };

  return (
    <div>
      <AddEditTimeSheet
        callBackEvent={() => fetchTimeSheetSummaryList()}
        ref={addEditModalRef}
      ></AddEditTimeSheet>

      <Container className="px-4">
        {data.map((m, i) => {
          return (
            <>
              <Row key={i} className="m-0">
                <Col md={10}>
                  <h6>
                    {m.ProjectName} - {m.TaskCategoryName}
                  </h6>
                  <p className="p-0 m-0 ms-2">
                    {(m.Attachment ?? "") != "" && (
                      <IconButton
                        edge="end"
                        aria-label="attachment"
                        onClick={async () => {
                          var href = `${StandardConst.apiBaseUrl}/uploads/${m.Attachment}`;
                          console.log(href);
                          window.open(href, "_blank");
                        }}
                      >
                        <FileIcon />
                      </IconButton>
                    )}
                    {m.Details}
                  </p>
                </Col>
                <Col
                  md={1}
                  className="d-flex align-items-center justify-content-end"
                >
                  <h5>{m.TimeInHour}</h5>
                </Col>
                <Col
                  md={1}
                  className="d-flex align-items-center justify-content-start"
                >
                  <IconButton
                    id="btnTimeSheetModel"
                    size="small"
                    onClick={() => fnEdit(m.TimeSheetId)}
                    style={{
                      color: primary,
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Col>
              </Row>
              <hr></hr>
            </>
          );
        })}
      </Container>
    </div>
  );
};

const TimeSheet = () => {
  const [bData, setBData] = React.useState([
    {
      title: "TimeSheet",
      hrefLink: "#",
    },
    {
      title: "Entry",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Time Sheet";
  PageInfo({ pageTitle: "Time Sheet" });
  const [key, setKey] = useState(0);
  const [now] = useState(DateTime.local());
  const [weekDays, setWeekDays] = useState([]);
  const setWeekDaysByWeekInView = (startDate) => {
    const s1 = Array.from({ length: 7 }).map((_, index) => {
      return {
        day: Info.weekdays("short")[index],
        date: startDate.plus({ day: index }),
        totalHour: 0,
        guid: uuid(),
      };
    });
    setWeekDays(s1);
  };
  const fnInit = () => {
    var weekInView = now.startOf("week");
    setWeekDaysByWeekInView(weekInView);
    setKey(now.weekday - 1);
  };
  const fnNext = () => {
    if (key == 6) {
      setWeekDaysByWeekInView(weekDays[6].date.plus({ day: 1 }));
      setKey(0);
    } else {
      setKey(key + 1);
    }
  };
  const fnBack = () => {
    if (key == 0) {
      setWeekDaysByWeekInView(weekDays[0].date.plus({ day: -7 }));
      setKey(6);
    } else {
      setKey(key - 1);
    }
  };

  useEffect(() => {
    fnInit();
  }, []);
  const addEditModalRef = useRef();
  const fnAdd = async () =>
    await addEditModalRef.current.openModal(
      null,
      weekDays[key].date.toFormat("yyyy-MM-dd"),
      weekDays[key]?.totalHour ?? 0
    );
  const fetchTimeSheetSummaryList = () => {
    let newArr = [...weekDays];
    newArr[key].guid = uuid();
    setWeekDays(newArr);
  };
  const weekWiseHourUpdate = (index, hour) => {
    let newArr = [...weekDays];
    if (newArr[index].totalHour != hour) {
      newArr[index].totalHour = hour;
      setWeekDays(newArr);
    }
  };
  return (
    <>
      <AddEditTimeSheet
        callBackEvent={() => fetchTimeSheetSummaryList()}
        ref={addEditModalRef}
      ></AddEditTimeSheet>
      <Container fluid className="base-container">
        <TopbarComponent bData={bData} HeadingText={MasterPageName} />
        <Row className="px-4 primary-bg-color mx-0 py-3">
          <Col className="col-md-6 d-flex justify-content-start">
            <div>
              <ButtonGroup>
                <Button
                  id="btnTimeSheetBack"
                  variant="outline-light"
                  onClick={() => fnBack()}
                >
                  {"<"}
                </Button>
                <Button
                  id="btnTimeSheetNext"
                  variant="outline-light"
                  onClick={() => fnNext()}
                >
                  {">"}
                </Button>
              </ButtonGroup>
            </div>
            <div
              style={{ marginLeft: "20px" }}
              className="d-flex align-items-center"
            >
              <h4 className="text-white">{`${
                weekDays[key]?.date?.weekdayLong
              }, ${weekDays[key]?.date?.toFormat("dd MMM")}`}</h4>
            </div>
          </Col>

          <Col className="col-md-6 d-flex justify-content-end">
            <Button
              className="text-white decoration-none"
              id="btnReturnTodayTimesheet"
              variant="link"
              onClick={() => fnInit()}
            >
              <i className="fa fa-arrow-left "></i> Return to Today
            </Button>
            <Button
              id="btnAddTimeSheet"
              variant="outline-light"
              onClick={() => fnAdd()}
              disabled={(weekDays[key]?.totalHour ?? 0) >= 24}
            >
              <i className="fa fa-plus"></i> Add
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mt-1"
              justify
            >
              {weekDays.map((m, i) => {
                return (
                  <Tab
                    key={uuid()}
                    eventKey={i}
                    title={`${m.day} (${m.totalHour})`}
                  >
                    <TimeSheetDateWiseSummary
                      date={m.date.toFormat("yyyy-MM-dd")}
                      guid={m.guid}
                      TotalHour={(hour) => weekWiseHourUpdate(i, hour)}
                    />
                  </Tab>
                );
              })}
            </Tabs>
          </Col>
        </Row>
        <Row>
          <Col className="col-md-12 d-flex align-items-center justify-content-end">
            <div style={{ marginRight: "100px" }}>
              <strong>Total: {weekDays[key]?.totalHour} </strong>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TimeSheet;
