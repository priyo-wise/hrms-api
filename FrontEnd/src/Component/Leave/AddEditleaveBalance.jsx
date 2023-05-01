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
const AddEditleaveBalance = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ leaveBalance: {} });
  const [formdate, setFormtDate] = useState();
  const [todate, setToDate] = useState();
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        endPoint: `leaveBalance/Fetch/${id || 0}`,
        dispatch,
      });
      if ((data?.leaveBalance?.ValidFormDate || "") !== "")
        data.leaveBalance.ValidFormDate = format(
          new Date(data.leaveBalance.ValidFormDate),
          "yyyy-MM-dd"
        );
      if ((data?.leaveBalance?.ValidToDate || "") !== "")
        data.leaveBalance.ValidToDate = format(
          new Date(data.leaveBalance.ValidToDate),
          "yyyy-MM-dd"
        );
      console.log("data leave", data.leaveType);

      data.leaveType = data.leaveType.map((v) => {
        return {
          value: v.LeaveId,
          text: v.LeaveName,
        };
      });
      data.Employee = data.Employee.map((v) => {
        return {
          value: v.id,
          text: v.name,
        };
      });

      setData(data);
      setShow(true);
    },
  }));
  const handleClose = () => setShow(false);
  const requiredMessage = "This is a required field";
  const schema = yup
    .object()
    .shape({
      NoOfLeaveDebited: yup.string().trim().required(requiredMessage),
    })
    .required();
  const successAlert = (res) => {
    SweetAlert.fire({
      text: res,
    });
  };
  const onSubmit = async (data) => {
    //alert(JSON.stringify(data));
    const responsedata = await WebService({
      endPoint: "leaveBalance/Submit",
      body: data,
      dispatch,
    });
    successAlert(responsedata);
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
          {(data.leaveBalance.leaveTransactionsId || 0) === 0 ? "Add" : "Edit"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.leaveBalance}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row mt-1">
            <FormInputDropdown
              name="EmployeeId"
              ddOpt={data.Employee}
              label="Employee"
            ></FormInputDropdown>
          </div>
          <div className="row mt-1">
            <FormInputDropdown
              name="leavetypeId"
              ddOpt={data.leaveType}
              label="Leave Type"
            ></FormInputDropdown>
          </div>
          <div className="row mt-1">
            <FormInputText
              label="Leave Valid From"
              name="ValidFormDate"
              setValue={(val) => setFormtDate(val)}
              type="date"
              min={new Date().toISOString().split("T")[0]}
              max="2999-12-31"
            />
          </div>
          <div className="row mt-1">
            <FormInputText
              label="Leave Valid To"
              name="ValidToDate"
              type="date"
              setValue={(val) => setToDate(val)}
              disabled={formdate == undefined ? true : false}
              min={
                formdate ? new Date(formdate).toISOString().split("T")[0] : ""
              }
              max="2999-12-31"
            />
          </div>
          <div className="row mt-1">
            <FormInputText
              label="Add Leave"
              name="NoOfLeaveDebited"
              type="number"
              isRequired="true"
            />
          </div>
          <div className="row mt-1">
            <FormInputText
              label="Leave Description"
              name="Notes"
              as="textarea"
            />
          </div>
          <FormInputText
            name="NoOfLeaveCredited"
            value="0"
            type="hidden"
          ></FormInputText>
          <FormInputText
            name="TransactionsType"
            value="Dr"
            type="hidden"
          ></FormInputText>
          <FormInputText
            name="TransactionByUserId"
            value={data.EmployeeID}
            type="hidden"
          ></FormInputText>
        </Modal.Body>
        <Modal.Footer>
          <Button
            id="btnleaveBalanceModelClose"
            variant="outline-danger"
            className="me-4"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            variant="outline-primary"
            id="btnleaveBalanceSubmit"
            type="submit"
          >
            {(data.leaveBalance.leaveTransactionsId || 0) === 0
              ? "Submit"
              : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditleaveBalance);
