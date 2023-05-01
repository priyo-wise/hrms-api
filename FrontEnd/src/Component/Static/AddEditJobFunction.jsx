import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText, FormInputDropdown } from "../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditJobFunction = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ JobFunction: {} });
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        endPoint: `JobFunction/Fetch/${id || 0}`,
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
      JobFunction: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    if (data.JobFunctionId === undefined) {
      await WebService({
        endPoint: "JobFunction/Create",
        body: data,
        dispatch,
      });
    } else {
      await WebService({
        endPoint: `JobFunction/Update/${data.JobFunctionId}`,
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
          {(data.JobFunction.JobFunctionId || 0) === 0
            ? "Add Job Function"
            : "Edit Job Function"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.JobFunction}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <div>
          <Modal.Body className="p-4">
            <div className="row">
              <div className="col-md-12">
                <FormInputText
                  label="Job Function"
                  name="JobFunction"
                  type="text"
                  isRequired="true"
                />
              </div>
              <div className="col-md-12">
                <FormInputText
                  name="JobDescription"
                  label="Description"
                  as="textarea"
                  rows="2"
                />
              </div>
            </div>
          </Modal.Body>
        </div>
        <hr />
        <div className="row col-md-12 p-3 m-2  mb-4">
          <div className="col-6 mt-2">
            <Button
              className="p-2 radius bg-light text-dark rounded btn-md w-75 col-4"
              id="btnJobFunctionModelClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
              id="btnJobFunctionSubmit"
              type="submit"
            >
              {(data.JobFunction.JobFunctionId || 0) === 0
                ? "Submit"
                : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditJobFunction);
