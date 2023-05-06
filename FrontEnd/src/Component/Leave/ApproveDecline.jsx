import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText, FormInputDropdown } from "../Form";
import * as yup from "yup";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import SweetAlert from "sweetalert2";
import { ActionPermission, PageInfo } from "../PageInfo";
import DatePicker from "react-datepicker";
import Toast from "react-bootstrap/Toast";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditleave = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ ApplyLeave: {} });  
  const [empid, setEmployeeId] = useState();  
  const [empContact, setEmployeePhone] = useState();  
  const [formdate, setStarFormtDate] = useState();
  const [todate, setLeaveToDate] = useState();
  const LeaveStatusData = [
    { text: "Approved", value: 3 },
    { text: "Reject", value: 4 },
  ];
  const [account, setAccount] = useState({
    LeaveFromDate: "",
    LeaveToDate: "",
    reason: "",
    leavetype: "",
  });
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        endPoint: `Applyleave/Fetchleave/${id || 0}`,
        dispatch,
      });
      
      if ((data[0]?.LeaveFromDate || "") !== "")
        data[0].LeaveFromDate = format(
          new Date(data[0].LeaveFromDate),
          "yyyy-MM-dd"
        );
      if ((data[0]?.LeaveToDate || "") !== "")
        data[0].LeaveToDate = format(
          new Date(data[0].LeaveToDate),
          "yyyy-MM-dd"
        );
      setData(data);
      setShow(true);
    },
  }));
  PageInfo({ pageTitle: "Leave" });
  const [permission] = useState({
    ManageCancel: ActionPermission("Leave - Cancel"),
    ManageAprroveReject: ActionPermission("Leave - Approve Reject"),
  });
  const handleClose = () => setShow(false);
  const requiredMessage = "This is a required field";
  const schema = yup
    .object()
    .shape({
      leavestatus: yup.string().trim().required(requiredMessage),
      Comment: yup.string().trim().required(requiredMessage),
    })
    .required();

    const successAlert = (res) => {
      SweetAlert.fire({  
          text: res,
        }); 
  }
  const onSubmit = async (data) => {
    
    const diffInMs   = new Date(data.LeaveToDate) - new Date(data.LeaveFromDate)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    data.leavedays=diffInDays;
    const responsedata = await WebService({
      endPoint: "Applyleave/ChangeLeaveStatus",
      body: data,
      dispatch,
    });
    successAlert(responsedata);

    setShow(true);
    handleClose();
    prop.callBackEvent();
  };
  
const fnReject = async (id) => {
    let data = {
        LeavesId: id,
        StatusId: 1,
        ApprovalStatusId: 4,
      };
    await WebService({
      endPoint: "Applyleave/ChangeLeaveStatus",
      body: data,
      dispatch,
    });
    
    handleClose();
    prop.callBackEvent();
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
          {(data[0]?.LeavesId || 0) === 0 ? "Apply Leave" : "Approve/Reject Leave"}
        </Modal.Title>
      </Modal.Header>

      <Form
        defaultValues={data[0]}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row mt-1">
            <FormInputText
              label="Employee Name"
              name="FullName"
              disabled={true}
            />
          </div>
          <div className="row mt-1">
            <FormInputText
              label="Leave Type"
              name="LeaveName"
              disabled={true}
            />
          </div>
          <div className="row mt-1">
            <FormInputText
              label="Remaining Leave"
              name="Remainingleave"
              type="text"
              disabled={true}
            />
          </div>
           <div className="row mt-1">
            <FormInputText
              label="Leave From Date"
              name="LeaveFromDate"
              disabled={true}
            />
          </div>         
          <div className="row mt-1">
            <FormInputText
              label="Leave To Date"
              name="LeaveToDate"
              disabled={true}
            />
          </div>    
          <div className="row mt-1">
            <FormInputText
              name="Phone"
              label="Emergency Phone Number"
              disabled={true}
            />
          </div>    
          <div className="row mt-1">
            <FormInputText
              name="Comment"
              label="Remark"
              as="textarea"
            />
          </div>    
        {permission.ManageAprroveReject && (      
          <div className="row mt-1">
            <FormInputDropdown
              name="leavestatus"
              ddOpt={LeaveStatusData}
              label="Leave Status"
            ></FormInputDropdown>
          </div>)}
          <FormInputText
            name="EmployeeId"
            value={empid}
            type="hidden"
          ></FormInputText>
          <FormInputText
            name="leavedays"
            type="hidden"
          ></FormInputText>
        </Modal.Body>
        <Modal.Footer>  
        {permission.ManageCancel && (
          <> 
          <FormInputText
            name="leavestatus"
            value="2"
            type="hidden"
          ></FormInputText> 
        <Button id="btnleaveBalanceClose" variant="outline-danger" className="me-4" onClick={handleClose}>Close</Button>
          <Button
           id="btnleaveBalanceSubmit"
           variant="outline-primary"
           type="submit"
           >
            {(data[0]?.LeavesId || 0) === 0 ? "Submit" : "Cancel Leave"}
          </Button></>
        )}
        {permission.ManageAprroveReject && (
          <>
          <Button id="btnleaveApproveModelClose" variant="outline-danger" className="me-4" onClick={handleClose}>Close</Button>
        
          <Button 
          variant="outline-primary" 
          id="btnleaveApprovaleSubmit"
          type="submit"
          >Submit
          </Button></>
        )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditleave);
