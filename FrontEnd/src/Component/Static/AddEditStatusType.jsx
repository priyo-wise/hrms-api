import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText } from "../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditStatusTye = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ StatusType: {} });
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        endPoint: `StatusType/Fetch/${id || 0}`,
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
      Status: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    if (data.StatusId === undefined) {
      await WebService({
        endPoint: "StatusType/Create",
        body: data,
        dispatch,
      });
    } else {
      await WebService({
        endPoint: `StatusType/Update/${data.StatusId}`,
        method: "PUT",
        body: data,
        dispatch,
      });
    }
    handleClose();
    prop.callBackEvent();
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {(data.StatusType.StatusId || 0) === 0 ? "Add Status" : "Edit Status"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.StatusType}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-12">
              <FormInputText
                label="Status"
                name="Status"
                type="text"
                className="form-control"
                isRequired="true"
              />
            </div>
            <div className="col-md-12">
              <FormInputText
                name="StatusMeaning"
                label="Status Meaning"
                as="textarea"
                rows="2"
                className="form-control"
              />
            </div>
          </div>
        </Modal.Body>
        <hr />
        <div className="row col-md-12 p-3 m-2  mb-4">
          <div className="col-6 mt-2">
            <Button
              className="p-2 radius bg-light text-dark rounded btn-md w-75 col-4"
              id="btnStatusTypeModelClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-4"
              id="btnStatusTypeSubmit"
              type="submit"
            >
              {(data.StatusType.StatusId || 0) === 0
                ? "Submit"
                : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditStatusTye);
