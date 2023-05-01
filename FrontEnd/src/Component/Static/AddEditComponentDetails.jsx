import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputDropdown, FormInputText } from "../Form";
import { useDispatch } from "react-redux";
import * as yup from "yup";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditComponentDetails = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ MenuRole: {} });
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        endPoint: `ComponentDetails/Fetch/${id || 0}`,
        dispatch,
      });
      data.page = data.page.map((v) => {
        return {
          value: v.PageId || "" || null || undefined,
          text: v.PageName,
        };
      });
      data.component = data.component.map((v) => {
        return {
          value: v.ComponentId || "" || null || undefined,
          text: v.ComponentName,
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
      PageId: yup.string().trim().required(requiredMessage),
      ComponentId: yup.string().trim().required(requiredMessage),
      ComponentDetails: yup.string().trim().required(requiredMessage),
      ComponentClass: yup.string().trim().required(requiredMessage),
      Sequence: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    if (data.ComponentDetailsId === undefined) {
      await WebService({
        endPoint: "ComponentDetails/Create",
        body: data,
        dispatch,
      });
    } else {
      await WebService({
        endPoint: `ComponentDetails/Update/${data.ComponentDetailsId}`,
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
          {(data.PageId || 0) === 0 ? "Add Static Page" : "Edit Static Page"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.details}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-12">
              <FormInputText
                label="Component Details"
                name="ComponentDetails"
                type="text"
                isRequired="true"
              />
            </div>
            <div className="col-md-12">
              <FormInputDropdown
                name="PageId"
                ddOpt={data.page}
                label="Select Page"
                isRequired="true"
              ></FormInputDropdown>
            </div>
            <div className="col-md-12">
              <FormInputDropdown
                name="ComponentId"
                ddOpt={data.component}
                label="Select Component"
                isRequired="true"
              ></FormInputDropdown>
            </div>
            <div className="col-md-12">
              <FormInputText
                label="Component Class"
                name="ComponentClass"
                type="text"
                isRequired="true"
              />
            </div>
            <div className="col-md-12">
              <FormInputText
                label="Sequence"
                name="Sequence"
                type="text"
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
              id="btnComponentDetailsClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
              id="btnComponentDetailsSubmit"
              type="submit"
            >
              {(data.ComponentDetailsId || 0) === 0 ? "Submit" : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};
export default forwardRef(AddEditComponentDetails);
