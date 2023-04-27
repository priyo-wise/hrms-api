import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputDropdown, FormInputText } from "../Form";
import { useDispatch } from "react-redux";
import * as yup from "yup";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditStaticComponents = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ MenuRole: {} });
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        endPoint: `StaticComponents/Fetch/${id || 0}`,
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
      ComponentName: yup.string().trim().required(requiredMessage),
      ComponentDescription: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    if (data.ComponentId === undefined) {
      await WebService({
        endPoint: "StaticComponents/Create",
        body: data,
        dispatch,
      });
    } else {
      await WebService({
        endPoint: `StaticComponents/Update/${data.ComponentId}`,
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
          {(data.ComponentId || 0) === 0 ? "Add Component" : "Edit Component"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.Page}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-12">
              <FormInputText
                label="Component Name"
                name="ComponentName"
                type="text"
                isRequired="true"
              />
            </div>
            <div className="col-md-12">
              <FormInputText
                label="Description"
                name="ComponentDescription"
                as="textarea"
                rows="2"
                isRequired="true"
              />
            </div>
          </div>
        </Modal.Body>
        <hr />
        <div className="row col-md-12 p-3 m-2  mb-4">
          <div className="col-6 mt-2">
            <Button
              className="p-2 radius bg-light text-dark rounded btn-md w-75 col-4"
              id="btnStaticComponentsClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
              id="btnStaticComponentsSubmit"
              type="submit"
            >
              {(data.ComponentId || 0) === 0 ? "Submit" : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};
export default forwardRef(AddEditStaticComponents);
