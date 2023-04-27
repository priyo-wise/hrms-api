import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputDropdown, FormInputText } from "../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import "../Static/Master.css";
import Col from "react-bootstrap/Col";
import _ from "underscore";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditDocument = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ DocumentType: {} });

  const DocumentTypeData = [
    { value: "Yes", text: "Yes" },
    { value: "No", text: "No" },
  ];
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        endPoint: `DocumentType/Fetch/${id || 0}`,
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
      DocumentType: yup.string().trim().required(requiredMessage),
      Status: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    console.log(data);
    if (data.DocumentTypeId === undefined) {
      await WebService({
        endPoint: "DocumentType/Create",
        body: data,
        dispatch,
      });
    } else {
      await WebService({
        endPoint: `DocumentType/Update/${data.DocumentTypeId}`,
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
          {(data.DocumentType.DocumentTypeId || 0) === 0
            ? "Add Document Type"
            : "Edit Document Type"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.DocumentType}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-12">
              <FormInputText
                label="Document Type"
                name="DocumentType"
                type="text"
                isRequired="true"
              />
            </div>
            <div className="col-md-12">
              <FormInputText
                label="Status"
                name="Status"
                type="text"
                isRequired="true"
              />
            </div>
            <div className="col-md-12">
              <FormInputDropdown
                name="Mandatory"
                ddOpt={DocumentTypeData}
                label="Mandatory"
                isRequired="true"
              ></FormInputDropdown>
            </div>
          </div>
        </Modal.Body>
        <div className="row col-md-12 p-3 m-2  mb-4">
          <div className="col-6 mt-2">
            <Button
              className="p-2 radius bg-light text-dark rounded btn-md w-75 col-4"
              id="btnDocumentTypeModelClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
              id="btnDocumentTypeSubmit"
              type="submit"
            >
              {(data.DocumentType.DocumentTypeId || 0) === 0
                ? "Submit"
                : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditDocument);
