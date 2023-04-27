import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../../Services/WebService";
import { Form, FormInputText, FormInputDropdown } from "../../Form";
import * as yup from "yup";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import "./../Payslip.css";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditEmployee = (prop, ref) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ Payslip: {} });
  const dispatch = useDispatch();
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        dispatch,
        endPoint: `EmployeeSalaryTemplate/Fetch/${id || 0}`,
      });
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
      if ((data?.salaryTemp?.FromDate || "") !== "")
        data.salaryTemp.FromDate = format(
          new Date(data.salaryTemp.FromDate),
          "yyyy-MM-dd"
        );
      if ((data?.salaryTemp?.ToDate || "") !== "")
        data.salaryTemp.ToDate = format(
          new Date(data.salaryTemp.ToDate),
          "yyyy-MM-dd"
        );
      setData(data);
      setShow(true);
    },
  }));
  const handleClose = () => setShow(false);
  const requiredMessage = "This is a required field";
  const schema = yup
    .object()
    .shape({
      FromDate: yup.string().trim().required(requiredMessage),
      ToDate: yup.string().trim().required(requiredMessage),
      EmployeeId: yup.string().trim().required(requiredMessage),
      StatusId: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    await WebService({
      endPoint: "EmployeeSalaryTemplate/Create",
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
          {(data.SalaryTemplateId || 0) === 0
            ? "Add Employee Salary Template"
            : "Edit Employee Salary Template"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.salaryTemp}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-6">
              <FormInputText
                label="From Date"
                name="FromDate"
                type="date"
                isRequired="true"
              />
            </div>
            <div className="col-md-6">
              <FormInputText
                label="To Date"
                name="ToDate"
                type="date"
                isRequired="true"
              />
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
                isRequired="true"
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
            {(data.SalaryTemplateId || 0) === 0 ? "Submit" : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditEmployee);
