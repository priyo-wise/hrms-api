import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText } from "../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import SweetAlert from "sweetalert2";
import axios from "axios";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditCompany = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ Errorlog: {} });
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        endPoint: `CompanyProfile/Fetch/${id || 0}`,
        dispatch,
      });
      data.Errorlog.Logo = "";
      setData(data);
      setShow(true);
    },
  }));
  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const handleClose = () => setShow(false);
  const requiredMessage = "Field is a required";
  const schema = yup
    .object()
    .shape({
      CompanyName: yup.string().trim().required(requiredMessage),
    })
    .required();

  const successAlert = (res) => {
    SweetAlert.fire({
      text: res,
    });
  };
  const onSubmitDocument = async () => {
    const formData = new FormData();
    formData.append("image", file);
    if (data.Errorlog.CompanyId > 0) {
      formData.append("CompanyId", data.Errorlog.CompanyId);
    }
    try {
      await axios({
        method: "post",
        url: "http://localhost:3001/upload/uploadLogo",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const onSubmit = async (data) => {
    const doc = await onSubmitDocument();
    const responsedata = await WebService({
      endPoint: "CompanyProfile/Submit",
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
          {(data.Errorlog.CompanyId || 0) === 0
            ? "Add Company Info"
            : "Edit Company Info"}
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
              label="Company Name"
              name="CompanyName"
              type="text"
              isRequired="true"
            />
          </div>
          <div className="row mt-1">
            <FormInputText
              name="Type"
              label="Type"
              type="text"
              isRequired="true"
            />
          </div>
          <div className="row mt-1">
            <FormInputText
              name="Phone"
              label="Phone"
              type="text"
              isRequired="true"
            />
          </div>
          <div className="row mt-1">
            <FormInputText
              name="TIN"
              label="TIN"
              type="text"
              isRequired="true"
            />
          </div>
          <div className="row mt-1">
            <FormInputText
              name="PanNo"
              label="PAN Number"
              type="text"
              isRequired="true"
            />
          </div>
          <div className="row mt-1">
            <FormInputText name="Email" label="Email" type="text" />
          </div>
          <div className="row mt-1">
            <FormInputText label="Fax" name="Fax" type="text" />
          </div>
          <div className="row mt-1">
            <FormInputText
              label="State"
              name="State"
              type="text"
              isRequired="true"
            />
          </div>
          <div className="row mt-1">
            <FormInputText
              label="City"
              name="city"
              type="text"
              isRequired="true"
            />
          </div>
          <div className="row mt-1">
            <FormInputText
              label="Pincode"
              name="pincode"
              type="text"
              isRequired="true"
            />
          </div>
          <div className="row mt-1">
            <FormInputText
              label="Address Line 1"
              name="Address1"
              type="text"
              isRequired="true"
            />
          </div>
          <div className="row mt-1">
            <FormInputText label="Address Line 2" name="Address2" type="text" />
          </div>
          <div className="row mt-1">
            <FormInputText label="Address Line 3" name="Address3" type="text" />
          </div>
          <div className="row mt-1">
            <FormInputText label="Remarks" name="Remarks" type="text" />
          </div>
          <div className="row mt-1">
            <FormInputText
              label="Company Logo"
              name="Logo"
              type="file"
              onChange={saveFile}
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

export default forwardRef(AddEditCompany);
