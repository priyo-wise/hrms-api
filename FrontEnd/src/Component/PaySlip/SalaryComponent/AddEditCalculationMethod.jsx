import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../../Services/WebService";
import { Form, FormInputText, FormInputDropdown } from "../../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import "./../Payslip.css";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditCalculationMethod = (prop, ref) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ SalaryComponent: {} });
  const [checked, setChecked] = useState(true);
  const dispatch = useDispatch();
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        dispatch,
        endPoint: `CalculationMethod/${id || 0}`,
      }).then((c) => (c.length > 0 ? c[0] : {}));
      setData(data);
      setShow(true);
    },
  }));
  const handleClose = () => setShow(false);
  const requiredMessage = "This is a required field";
  const schema = yup
    .object()
    .shape({
      Code: yup.string().trim().required(requiredMessage),
      CalculationMethod: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    data.Status = checked == true ? 1 : 0;
    console.log(JSON.stringify(data));
    let endPoint = "CalculationMethod";
    let method = "POST";
    if ((data.CalculationMethodId ?? 0) !== 0) {
      endPoint = `CalculationMethod/${data.CalculationMethodId}`;
      method = "PUT";
    }
    await WebService({ dispatch, endPoint, body: data, method });
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
          {(data.SalaryComponentsId || 0) === 0
            ? "Add Calculation Method"
            : "Edit Calculation Method"}
        </Modal.Title>
      </Modal.Header>
      <Form defaultValues={data} onSubmit={onSubmit} validationSchema={schema}>
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-6">
              <FormInputText
                label="Code"
                name="Code"
                type="text"
                isRequired="true"
              />
            </div>
            <div className="col-md-6">
              <FormInputText
                label="Calculation Method"
                name="CalculationMethod"
                type="text"
                isRequired="true"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#16192c",
                  marginRight: "80px",
                }}
              >
                Status
              </label>
              <FormCheckInput
                label="Status"
                name="Status"
                type="checkbox"
                defaultChecked={checked}
                onChange={() => setChecked(!checked)}
              />
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
            {(data.SalaryComponentsId || 0) === 0 ? "Submit" : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditCalculationMethod);
