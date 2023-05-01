import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText, FormInputDropdown } from "../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import _ from "underscore";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditTaskType = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({});
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        endPoint: `TaskType/${id || 0}`,
        dispatch,
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
      CoreCode: yup.string().trim().required(requiredMessage),
      DisplayDescription: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    var endPoint = "TaskType";
    var method = "POST";
    if ((data.TaskTypeId ?? 0) !== 0) {
      endPoint += `/${data.TaskTypeId}`;
      method = "PUT";
    }
    await WebService({
      dispatch,
      endPoint,
      method,
      body: _.omit(data, "TaskTypeId"),
    });

    handleClose();
    prop.callBackEvent();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {(data.TaskTypeId || 0) === 0 ? "Add Task-Type" : "Edit Task-Type"}
        </Modal.Title>
      </Modal.Header>
      <Form defaultValues={data} onSubmit={onSubmit} validationSchema={schema}>
        <Modal.Body className="p-4 mb-5">
          <Row>
            <Col md={12}>
              <FormInputText
                label="Code"
                name="CoreCode"
                type="text"
                className="form-control"
                isRequired="true"
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FormInputText
                label="Description"
                name="DisplayDescription"
                type="text"
                className="form-control"
                isRequired="true"
              />
            </Col>
          </Row>
        </Modal.Body>
        <hr />
        <div className="row col-md-12 p-3 m-2  mb-4">
          <div className="col-6 mt-2">
            <Button
              className="p-2 radius bg-light text-dark rounded btn-md w-75 col-4"
              id="btnTaskTypeModelClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
              id="btnTaskTypeSubmit"
              type="submit"
            >
              {(data.TaskTypeId || 0) === 0 ? "Submit" : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditTaskType);
