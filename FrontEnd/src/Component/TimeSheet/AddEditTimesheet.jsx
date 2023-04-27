import React, { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText, FormInputDropdown, FormInputFile } from "../Form";
import * as yup from "yup";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { DateTime, Info } from "luxon";
import { map, omit, sortBy } from "underscore";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { StandardConst } from "../../Services/StandardConst";
import { Alert, AlertTitle, IconButton, Paper } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const AddEditTimeSheet = (prop, ref) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ TimeSheet: {} });
  const [maxHour, setMaxHour] = useState(8);
  const [projectList, setProjectList] = useState([]);
  const [holiday, setHoliday] = useState([]);
  const [approvedLeave, setApprovedLeave] = useState([]);
  const dispatch = useDispatch();
  const afterRender = useRef(false);
  const formRef = useRef();
  React.useImperativeHandle(ref, () => ({
    openModal: async (id, date, completedHours = 0) => {
      setMaxHour(24 - completedHours > 8 ? 8 : 24 - completedHours);
      const data = await WebService({
        dispatch,
        endPoint: `TimeSheet/FetchAll/${id || 0}/${date}`,
      });

      if ((data?.TimeSheet?.Date || "") !== "")
        data.TimeSheet.Date = format(
          new Date(data.TimeSheet.Date),
          "yyyy-MM-dd"
        );
      else {
        data.TimeSheet ??= {};
        data.TimeSheet.Date = date;
      }
      data.users = map(data?.users ?? [], (v) => {
        return {
          value: v.EmployeeId,
          text: v.FullName,
        };
      });
      data.task = await WebService({
        dispatch,
        endPoint:
          "CommonUtility/taskcategorymaster?select=TaskCategoryId,TaskCategoryName",
      }).then((ds) => sortBy(ds??[],s=>s.TaskCategoryName)
        .map((v) => {
          return {
            value: v.TaskCategoryId,
            text: v.TaskCategoryName,
          };
        })
      );

      setHoliday(data.holiday[0]);
      setApprovedLeave(data.approvedLeave[0]);

      setData(omit(data, "project"));
      setShow(true);
    },
  }));
  const handleClose = () => setShow(false);
  const requiredMessage = "This is a required field";
  const schema = yup
    .object()
    .shape({
      TimeInHour: yup
        .number()
        .label("Time in Hour")
        .typeError(requiredMessage)
        .required(requiredMessage)
        .min(0.01)
        .when([], (_, passSchema) => passSchema.max(maxHour)),
      ProjectId: yup.string().trim().required(requiredMessage),
      TaskCategoryId: yup.string().trim().required(requiredMessage),
      Details: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    if ((data.File?.size ?? 0) > 0)
      await WebService({
        endPoint: "upload/File",
        dispatch,
        body: data.File,
        isFile: true,
      }).then((res) => {
        data.Attachment = res.filename;
      });
    data = omit(data, "File");
    var endPoint = "TimeSheet/Submit";
    var method = "POST";
    if ((data.TimeSheetId || 0) != 0) {
      method = "PUT";
      endPoint += `/${data.TimeSheetId}`;
    }
    await WebService({ dispatch, endPoint, method, body: data });

    handleClose();
    prop.callBackEvent();
  };
  const fnDelete = async () => {
    await WebService({
      endPoint: `TimeSheet/${data.TimeSheet.TimeSheetId}`,
      method: "DELETE",
      dispatch,
    });
    handleClose();
    prop.callBackEvent();
  };
  React.useEffect(() => {
    if (!afterRender.current) {
      fetchProject();
    }
    afterRender.current = true;
  }, []);
  const fetchProject = async () => {
    setProjectList(
      await WebService({ dispatch, endPoint: "Project/byLoggedUser" }).then(
        (c) =>
          map(c ?? [], (m) => ({ value: m.ProjectId, text: m.ProjectName }))
      )
    );
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {(data.TimeSheet.TimeSheetId || 0) === 0 ? "Add" : "Edit"} time entry
          for {DateTime.fromSQL(data.TimeSheet.Date).weekdayLong},{" "}
          {DateTime.fromSQL(data.TimeSheet.Date).toFormat("dd MMM")}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.TimeSheet}
        onSubmit={onSubmit}
        validationSchema={schema}
        ref={formRef}
      >
        <>
          <Paper
            elevation={0}
            className={`${holiday.HolidayCount >= 1 ? "d-inline" : "d-none"}`}
          >
            <Alert severity="error" icon={<NotificationsActiveIcon />}>
              <AlertTitle>Holiday Notice</AlertTitle>
              This is an Holiday — <strong>{holiday.HolidayName}</strong>
            </Alert>
          </Paper>
          <Paper
            elevation={0}
            className={`${approvedLeave.Leaves >= 1 ? "d-inline" : "d-none"}`}
          >
            <Alert severity="info" icon={<NotificationsActiveIcon />}>
              <AlertTitle>Leave Notice</AlertTitle>
              You are on leave From{" "}
              <strong>{approvedLeave.LeaveFromDate} </strong> To{" "}
              <strong>{approvedLeave.LeaveToDate} </strong>
              as per leave records
            </Alert>
          </Paper>

          <Modal.Body class="p-3">
            <div class="container-fluid p-1">
              <div class="row">
                <FormInputText
                  label="Time"
                  name="TimeInHour"
                  type="number"
                  isRequired="true"
                />
                <FormInputDropdown
                  name="ProjectId"
                  ddOpt={projectList}
                  label="Project"
                  isRequired="true"
                ></FormInputDropdown>
                <FormInputDropdown
                  name="TaskCategoryId"
                  ddOpt={data.task}
                  label="Task"
                  isRequired="true"
                ></FormInputDropdown>
                <FormInputText
                  label="Details"
                  name="Details"
                  as="textarea"
                  isRequired="true"
                />
                {(data?.TimeSheet?.Attachment ?? "") == "" && (
                  <FormInputFile name="File" type="file" label="Attachment" />
                )}
                {(data?.TimeSheet?.Attachment ?? "") != "" && (
                  <Row>
                    <Col md={5}>Attachment</Col>
                    <Col md={7}>
                      <a
                        href={`${StandardConst.apiBaseUrl}/uploads/${data?.TimeSheet?.Attachment}`}
                        target="_blank"
                      >
                        {data?.TimeSheet?.Attachment}
                      </a>
                      <IconButton
                        id="btn_RemoveAttachment"
                        size="small"
                        onClick={() => {
                          setData((data) => ({
                            ...data,
                            TimeSheet: (TimeSheet) => ({
                              ...TimeSheet,
                              Attachment: null,
                            }),
                          }));
                          formRef.current.fnReset((formValues) => ({
                            ...formValues,
                            Attachment: null,
                          }));
                        }}
                        color="error"
                        aria-label="upload picture"
                        component="label"
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Col>
                  </Row>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-danger"
              id="btnTimeSheetModelClose"
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              variant="outline-primary"
              id="btnSubmitTimeSheet"
              type="submit"
            >
              {(data.TimeSheet.TimeSheetId || 0) === 0
                ? "Submit"
                : "Save Changes"}
            </Button>
            {(data.TimeSheet.TimeSheetId || 0) === 0 ? (
              ""
            ) : (
              <Button
                variant="outline-danger"
                id="btnDeleteTimeSheetData"
                onClick={fnDelete}
              >
                Delete
              </Button>
            )}
          </Modal.Footer>
        </>
      </Form>
    </Modal>
  );
};

export default React.forwardRef(AddEditTimeSheet);
