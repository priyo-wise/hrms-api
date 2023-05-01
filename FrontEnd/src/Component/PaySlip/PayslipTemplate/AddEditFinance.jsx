import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../../Services/WebService";
import { Form, FormInputText, FormInputDropdown } from "../../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import "./../Payslip.css";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditFinance = (prop, ref) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ Payslip: {} });
  const dispatch = useDispatch();
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        dispatch,
        endPoint: `FinanceTemplate/Fetch/${id || 0}`,
      });
      console.log("da", data);
      data.user = data.user.map((v) => {
        return {
          value: v.EmployeeId,
          text: v.FullName,
        };
      });
      data.status = data.status.map((v) => {
        return {
          value: v.StatusId,
          text: v.Status,
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
      BankAccountNo: yup.number().required(requiredMessage),
      NameInAccount: yup.string().trim().required(requiredMessage),
      BankName: yup.string().trim().required(requiredMessage),
      IFSCCode: yup.string().trim().required(requiredMessage),
      EmployeeId: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    await WebService({
      endPoint: "FinanceTemplate/Create",
      body: data,
      dispatch,
    });
    handleClose();
    prop.callBackEvent();
  };
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter "
      centered
      show={show}
      onHide={handleClose}
      className="container-fluid"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {(data.FinanceId || 0) === 0
            ? "Add Finance Template"
            : "Edit Finance Template"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.finance}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-6">
              <FormInputText
                label="Bank Name"
                name="BankName"
                type="text"
                isRequired="true"
              />
            </div>
            <div className="col-md-6">
              <FormInputText
                label="Bank Account Number"
                name="BankAccountNo"
                type="number"
                isRequired="true"
              />
            </div>
            <div className="col-md-6">
              <FormInputText
                label="Name In Account"
                name="NameInAccount"
                type="text"
                isRequired="true"
              />
            </div>
            <div className="col-md-6">
              <FormInputText
                label="IFSC Code"
                name="IFSCCode"
                type="text"
                isRequired="true"
              />
            </div>
            <div className="col-md-6">
              <FormInputText
                label="PF Account Number"
                name="PFAccountNo"
                type="number"
              />
            </div>
            <div className="col-md-6">
              <FormInputText label="PF UAN Number" name="PFUANNo" type="text" />
            </div>
            <div className="col-md-6">
              <FormInputDropdown
                name="EmployeeId"
                ddOpt={data.user}
                label="Select User"
                isRequired="true"
              ></FormInputDropdown>
            </div>
            <div className="col-md-6">
              <FormInputDropdown
                name="StatusId"
                ddOpt={data.status}
                label="Select Status"
              ></FormInputDropdown>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-danger"
            className="me-4"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button variant="outline-primary" type="submit">
            {(data.FinanceId || 0) === 0 ? "Submit" : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditFinance);
