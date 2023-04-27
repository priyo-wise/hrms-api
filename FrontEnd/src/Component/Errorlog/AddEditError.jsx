import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText } from "../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import SweetAlert from "sweetalert2";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditError = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ Errorlog: {} });
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        endPoint: `Errorlog/Fetch/${id || 0}`,
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
      // KRAShortDescription: yup.string().trim().required(requiredMessage),
      // KRADescription: yup.string().trim().required(requiredMessage),
    })
    .required();

  const successAlert = (res) => {
    SweetAlert.fire({
      text: res,
    });
  };

  const onSubmit = async (data) => {
    //alert(JSON.stringify(data));
    const responsedata = await WebService({
      endPoint: "Errorlog/Submit",
      body: data,
      dispatch,
    });
    successAlert(responsedata);
    handleClose();
    prop.callBackEvent();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {(data.Errorlog.ErrorId || 0) === 0 ? "Add Error" : "Edit Error"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.Errorlog}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row mt-1">
            <FormInputText
              label="Error Number"
              name="ErrorNumber"
              type="text"
              isRequired="true"
            />
          </div>
          <div className="row mt-1">
            <FormInputText
              name="ErrorCode"
              label="Error Code"
              type="text"
              isRequired="true"
            />
          </div>
          <div className="row mt-1">
            <FormInputText
              label="Error Description"
              name="ErrorDescription"
              type="text"
              isRequired="true"
            />
          </div>
        </Modal.Body>
        <hr />
        <div className="row col-md-12 p-3 m-2  mb-4">
          <div className="col-6 mt-2">
            <Button
              className="p-2 radius bg-light text-dark rounded btn-md w-75 col-4"
              id="btnErrorModelClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
              id="btnErrorlogSubmit"
              type="submit"
            >
              {(data.Errorlog.ErrorId || 0) === 0 ? "Submit" : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditError);
