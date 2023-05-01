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
const AddEditTemplate = (prop, ref) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ Payslip: {} });
  const dispatch = useDispatch();
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        dispatch,
        endPoint: `SalaryTemplate/Fetch/${id || 0}`,
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
      TemplateName: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    console.log(JSON.stringify(data));
    let endPoint = "SalaryTemplate/Create";
    let method = "POST";
    if ((data.TemplateId ?? 0) !== 0) {
      endPoint = `SalaryTemplate/Update/${data.TemplateId}`;
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
          {(data.TemplateId || 0) === 0
            ? "Add Salary Template"
            : "Edit Salary Template"}
        </Modal.Title>
      </Modal.Header>
      <Form defaultValues={data} onSubmit={onSubmit} validationSchema={schema}>
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-6">
              <FormInputText
                label="Name"
                name="TemplateName"
                type="text"
                isRequired="true"
              />
            </div>
            <div className="col-md-6">
              <FormInputText
                label="Description"
                name="Description"
                as="textarea"
                rows="2"
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
            {(data.TemplateId || 0) === 0 ? "Submit" : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditTemplate);
