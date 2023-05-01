/* #region Import */
import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import {
  Form,
  FormInputText,
  FormInputDropdown,
  InputText,
  FormInputDatePicker,
} from "../Form";
import * as yup from "yup";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../Static/Static.css";
import { ActionPermission } from "../PageInfo";
import _ from "underscore";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
/* #endregion */
const { forwardRef, useState, useImperativeHandle, useRef, useEffect } = React;
const KraDetails = ({ value, setValue }) => {
  const [data, setData] = useState(value);
  const [permission] = useState({
    ManageEmployeeSelfAssessment: ActionPermission(
      "Performance - Employee Self Assessment"
    ),
    ManageManagerAssessment: ActionPermission(
      "Performance - Manager Assessment"
    ),
  });
  useEffect(() => {
    setValue(data);
  }, [data]);

  return (
    <TableRow className="col-md-12">
      <TableCell className="table-td-center">
        {data.KRAShortDescription}
      </TableCell>
      <TableCell className="table-td-left">{data.KRADescription}</TableCell>
      <TableCell className="table-td-center">
        <InputText
          name="EmplyeeSelfAssessment"
          as="textarea"
          value={data.EmployeeSelfAssessment}
          setValue={(val) => setData({ ...data, EmployeeSelfAssessment: val })}
          disabled={!permission.ManageEmployeeSelfAssessment}
        />
      </TableCell>
      <TableCell className="table-td-center">
        <InputText
          name="ManagerAssessment"
          as="textarea"
          value={data.ManagerAssessment}
          setValue={(val) => setData({ ...data, ManagerAssessment: val })}
          disabled={!permission.ManageManagerAssessment}
        />
      </TableCell>
    </TableRow>
  );
};
const AddEditPerformanceComponent = (prop, ref) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ performance: {} });
  const [records, setRecords] = useState([]);
  const [permission] = useState({
    ManageUser: ActionPermission("Performance - Select User"),
    ManageDate: ActionPermission("Performance - Modify Date"),
    ManageEmpRating: ActionPermission("Performance - Employee Rating"),
    ManageMangerRating: ActionPermission("Performance - Manager Rating"),
    ManageFinalRating: ActionPermission("Performance - Final Rating"),
    ManageFinalReviewComment: ActionPermission(
      "Performance - Final Review Comment"
    ),
    ManageHRComment: ActionPermission("Performance - HR Comment"),
  });
  const dispatch = useDispatch();
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        dispatch,
        endPoint: `Performance/Fetch/${id || 0}`,
      });
      setRecords(data.details);

      data.users = await WebService({
        endPoint: "User/ActiveUserList",
        dispatch,
      }).then((res) =>
        _.map(res, (m) => {
          return {
            value: m.EmployeeId,
            text: m.FullName,
          };
        })
      );
      setData(data);
      setShow(true);
    },
  }));
  const handleClose = () => setShow(false);
  const requiredMessage = "Field is a required";
  const ratingRangeErrorMessage = "Range between 1 to 5";
  const schema = yup
    .object()
    .shape({
      EmployeeId: yup
        .number()
        .typeError(requiredMessage)
        .required(requiredMessage),
      FromDate: yup.date().typeError(requiredMessage).required(requiredMessage),
      ToDate: yup
        .date()
        .typeError(requiredMessage)
        .required(requiredMessage)
        .when("FromDate", (fromDate, passSchema) =>
          fromDate.toLocaleString() === "Invalid Date"
            ? passSchema
            : passSchema.min(fromDate)
        ),
      EmpSelfScore: yup
        .number()
        .typeError(requiredMessage)
        .min(1, ratingRangeErrorMessage)
        .max(5, ratingRangeErrorMessage)
        .when([], (_, passSchema) =>
          permission.ManageEmpRating
            ? passSchema.required(requiredMessage)
            : passSchema
        ),
      FinalAgreedScore: yup
        .number()
        .typeError(requiredMessage)
        .min(1, ratingRangeErrorMessage)
        .max(5, ratingRangeErrorMessage)
        .when([], (_, passSchema) =>
          permission.ManageFinalRating
            ? passSchema.required(requiredMessage)
            : passSchema
        ),
      ManagerScore: yup
        .number()
        .typeError(requiredMessage)
        .min(1, ratingRangeErrorMessage)
        .max(5, ratingRangeErrorMessage)
        .when([], (_, passSchema) =>
          permission.ManageMangerRating
            ? passSchema.required(requiredMessage)
            : passSchema
        ),
    })
    .required();
  const onSubmit = async (data) => {
    data.details = records;
    await WebService({ dispatch, endPoint: "Performance/Submit", body: data });

    handleClose();
    prop.callBackEvent();
  };
  const formRef = useRef();
  const commonStyles = {
    border: 1,
    borderBottom: 1,
    borderColor: "grey",
    p: 2,
  };

  const boxCommonStyles = {
    "& > :not(style)": {
      m: 1,
    },
  };
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcente"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {(data.performance.PerformanceId || 0) === 0
              ? "Add Performance"
              : "Edit performance"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            defaultValues={data.performance}
            onSubmit={onSubmit}
            validationSchema={schema}
            ref={formRef}
            id="hook-form"
          >
            <Box
              sx={{
                ...boxCommonStyles,
              }}
            >
              <Paper
                square
                elevation={0}
                sx={{
                  ...commonStyles,
                }}
              >
                <Row>
                  <Col className="col-md-6">
                    {" "}
                    <FormInputDropdown
                      name="EmployeeId"
                      ddOpt={data.users}
                      label="Select User"
                      className="form-control"
                      disabled={!permission.ManageUser}
                      isRequired="true"
                    ></FormInputDropdown>
                  </Col>

                  <Col className="col-md-6">
                    <FormInputDatePicker
                      label="From Date"
                      name="FromDate"
                      className="form-control"
                      disabled={!permission.ManageDate}
                      isRequired="true"
                      setValue={(v) =>
                        setData({
                          ...data,
                          performance: { ...data.performance, FromDate: v },
                        })
                      }
                      max={data?.performance?.ToDate}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="col-md-6">
                    {" "}
                    <FormInputDatePicker
                      label="To Date"
                      name="ToDate"
                      type="date"
                      className="form-control"
                      disabled={!permission.ManageDate}
                      isRequired="true"
                      setValue={(v) =>
                        setData({
                          ...data,
                          performance: { ...data.performance, ToDate: v },
                        })
                      }
                      min={data?.performance?.FromDate}
                    />
                  </Col>

                  <Col className="col-md-6">
                    {" "}
                    <FormInputText
                      label="Employee Rating"
                      name="EmpSelfScore"
                      type="number"
                      className="form-control"
                      disabled={!permission.ManageEmpRating}
                      isRequired="true"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="col-md-6">
                    <FormInputText
                      label="Manager Rating"
                      name="ManagerScore"
                      type="number"
                      className="form-control"
                      disabled={!permission.ManageMangerRating}
                      isRequired="true"
                    />
                  </Col>
                  <Col className="col-md-6">
                    <FormInputText
                      label="Final Rating"
                      name="FinalAgreedScore"
                      type="number"
                      className="form-control"
                      disabled={!permission.ManageFinalRating}
                      isRequired="true"
                    />
                  </Col>{" "}
                </Row>
                <Row>
                  <Col className="col-md-6">
                    <FormInputText
                      label="Final Review Comment"
                      name="FinalReviewComments"
                      as="textarea"
                      className="form-control"
                      disabled={!permission.ManageFinalReviewComment}
                    />
                  </Col>
                  <Col className="col-md-6">
                    <FormInputText
                      label="HR Comments"
                      name="HRComments"
                      as="textarea"
                      className="form-control"
                      disabled={!permission.ManageHRComment}
                    />
                  </Col>
                </Row>
              </Paper>
            </Box>
            <Box
              sx={{
                ...boxCommonStyles,

                p: 0,
              }}
            >
              <Paper
                square
                elevation={0}
                sx={{
                  ...commonStyles,
                  p: 0,
                }}
              >
                <h5 className="text-center mt-1">KRA Details</h5>
              </Paper>
            </Box>
            <Box
              sx={{
                ...boxCommonStyles,

                p: 0,
              }}
            >
              <Paper
                square
                elevation={0}
                sx={{
                  ...commonStyles,
                  p: 0,
                }}
              >
                <Row className="p-0">
                  <Col>
                    <Table table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <strong>Short Desc</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Description</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Self Assessment</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Manager Assessment</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <tbody>
                        {records.map((detail, index) => (
                          <KraDetails
                            value={detail}
                            key={index}
                            setValue={(val) => {
                              let newArr = [...records];
                              newArr[index] = val;
                              setRecords(newArr);
                            }}
                          />
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Paper>
            </Box>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <div>
            <Button
              id="btnPerformanceModelClose"
              variant="outline-danger"
              className="me-4"
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              variant="outline-primary"
              id="btnPerformanceSubmit"
              type="submit"
              form="hook-form"
            >
              {(data.performance.PerformanceId || 0) === 0
                ? "Submit"
                : "Save Changes"}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default forwardRef(AddEditPerformanceComponent);
