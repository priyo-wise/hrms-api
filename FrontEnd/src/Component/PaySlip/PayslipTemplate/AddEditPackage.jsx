import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../../Services/WebService";
import { Form, FormInputText, FormInputDropdown } from "../../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import "./../Payslip.css";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditPackage = (prop, ref) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ Payslip: {} });
  const dispatch = useDispatch();
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        dispatch,
        endPoint: `PackageDetails/Fetch/${id || 0}`,
      });
      console.log(data);
      data.component = data.component.map((v) => {
        return {
          value: v.SalaryComponentsId,
          text: v.EarningOrDeductionName,
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
      Amount: yup.string().trim().required(requiredMessage),
      SalaryComponentId: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    await WebService({
      endPoint: "PackageDetails/Create",
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
          {(data.EmployeePackageId || 0) === 0
            ? "Add Salary Details"
            : "Edit Salary Details"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.package}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-6">
              <FormInputText
                label="Amount"
                name="Amount"
                type="number"
                isRequired="true"
              />
            </div>
            <div className="col-md-6">
              <FormInputDropdown
                name="SalaryComponentId"
                ddOpt={data.component}
                label="Select Type"
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
            {(data.EmployeePackageId || 0) === 0 ? "Submit" : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditPackage);
