import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText, FormInputDropdown } from "../Form";
import * as yup from "yup";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import SweetAlert from "sweetalert2";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditleave = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ ApplyLeave: {} });
  const [empid, setEmployeeId] = useState();
  const [empContact, setEmployeePhone] = useState();
  const [formdate, setStarFormtDate] = useState();
  const [todate, setLeaveToDate] = useState();
  const [minDate, setmintDate] = useState(new Date(formdate));

  const [account, setAccount] = useState({
    LeaveFromDate: "",
    LeaveToDate: "",
    reason: "",
    leavetype: "",
  });
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        endPoint: `Applyleave/Fetch/${id || 0}`,
        dispatch,
      });
      if ((data?.ApplyLeave?.LeaveFromDate || "") !== "")
        data.ApplyLeave.LeaveFromDate = format(
          new Date(data.ApplyLeave.LeaveFromDate),
          "yyyy-MM-dd"
        );
      if ((data?.ApplyLeave?.LeaveToDate || "") !== "")
        data.ApplyLeave.LeaveToDate = format(
          new Date(data.ApplyLeave.LeaveToDate),
          "yyyy-MM-dd"
        );
      data.leaveType = data.leaveType.map((v) => {
        return {
          value: v.LeaveId,
          text: v.LeaveName,
        };
      });
      var msDiff =
        new Date(data.ApplyLeave.LeaveToDate).getTime() -
        new Date(data.ApplyLeave.LeaveFromDate).getTime(); //Future date - current date
      var dayscount = Math.floor(msDiff / (1000 * 60 * 60 * 24));
      setData(data);

      setEmployeeId(data?.EmployeeData[0]?.EmployeeId);
      setEmployeePhone(data?.EmployeeData[0]?.EmergencyPhone);
      setShow(true);
    },
  }));
  const handleClose = () => setShow(false);
  const requiredMessage = "This is a required field";
  const numberError = "Character is not valid";
  const mobileMessage = "Mobile should be 10 Digit";
  const schema = yup
    .object()
    .shape({
      LeaveFromDate: yup.string().trim().required(requiredMessage),
      LeaveToDate: yup.string().trim().required(requiredMessage),
      Remarks: yup.string().trim().required(requiredMessage),
      Phone: yup
        .number()
        .required(requiredMessage)
        .typeError(numberError)
        .min(1000000000, mobileMessage),
    })
    .required();

  const successAlert = (res) => {
    SweetAlert.fire({
      text: res,
    });
  };

  const onSubmit = async (data) => {
    //alert(JSON.stringify(data));
    const diffInMs = new Date(data.LeaveToDate) - new Date(data.LeaveFromDate);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    data.leavedays = diffInDays;

    const responsedata = await WebService({
      endPoint: "Applyleave/Submit",
      body: data,
      dispatch,
    });
    successAlert(responsedata);

    setShow(true);
    handleClose();
    prop.callBackEvent();
  };
  const disablePastDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };
  const checkPreviousDate = async (date) => {
    console.log("formdate", formdate);
    console.log("todate", todate);
    console.log("date", date);
    // if(formdate != undefined){
    //   todate=undefined;
    // }
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      show={show}
      onHide={handleClose}
      centered
      className="container-fluid"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {(data.ApplyLeave.LeavesId || 0) === 0
            ? "Add Leaves"
            : data.ApplyLeave.ApprovalStatusId == 3
            ? "Leave Already Approved. You Can't Edit"
            : "Edit Leaves"}
        </Modal.Title>
      </Modal.Header>

      <Form
        defaultValues={data.ApplyLeave}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row mt-1">
            <FormInputText
              label="Leave From Date"
              name="LeaveFromDate"
              setValue={(val) => setStarFormtDate(val)}
              type="date"
              min={new Date().toISOString().split("T")[0]}
              max="2999-12-31"
              isRequired="true"
              // onKeyDown={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="row mt-1">
            <FormInputText
              label="Leave To Date"
              name="LeaveToDate"
             // onkeypress={false}
              type="date"
              setValue={(val) => setLeaveToDate(val)}
              disabled={formdate == undefined ? true : false}
              min={
                formdate ? new Date(formdate).toISOString().split("T")[0] : ""
              }
              // max={minDate.setDate(minDate.getDate() + 5)}
             // onKeyDown={(e) => e.preventDefault()}
             max="2999-12-31"
              isRequired="true"
            />
          </div>
          <div className="row mt-1">
            <FormInputDropdown
              name="LeaveTypeId"
              ddOpt={data.leaveType}
              label="Leave Type"
              isRequired="true"
            ></FormInputDropdown>
          </div>
          <div className="row mt-1">
            <FormInputText
              name="Phone"
              label="Emergency Phone Number"
              type="text"
              minLength={10}
              maxLength={10}
              value={data.ApplyLeave.LeavesId > 0 ? data.Phone : empContact}
              isRequired="true"
            />
          </div>
          <div className="row mt-1">
            <FormInputText
              name="Remarks"
              label="Reason for Leave"
              as="textarea"
              isRequired="true"
            />
          </div>
          <FormInputText
            name="EmployeeId"
            value={empid}
            type="hidden"
          ></FormInputText>
          <FormInputText
            name="leavedays"
            type="hidden"
            isRequired="true"
          ></FormInputText>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-danger"
            className="me-4"
            id="btnApplyleaveClose"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            variant="outline-primary"
            id="btnSubmitleave"
            type="submit"
            disabled={data.ApplyLeave.ApprovalStatusId == 3 ? true : false}
          >
            {(data.ApplyLeave.LeavesId || 0) === 0 ? "Submit" : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditleave);
