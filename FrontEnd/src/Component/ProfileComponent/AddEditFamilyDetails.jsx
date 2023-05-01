import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText, FormInputDropdown } from "../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import _ from "underscore";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditFamilyDetails = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [Info, setInfo] = useState({ FamilyDetails: {} });
  const GenderData = [
    { value: "Male", text: "Male" },
    { value: "Female", text: "Female" },
    { value: "Other", text: "Other" },
  ];
  const BloodGroupData = [
    { value: "A+", text: "A+" },
    { value: "A-", text: "A-" },
    { value: "B+", text: "B+" },
    { value: "B-", text: "B-" },
    { value: "AB+", text: "AB+" },
    { value: "AB-", text: "AB-" },
    { value: "O+", text: "O+" },
    { value: "O-", text: "O-" },
  ];
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        endPoint: `FamilyDetails/Fetch/${id || 0}`,
        dispatch,
      });
      setInfo(data);
      setShow(true);
    },
  }));
  const handleClose = () => setShow(false);
  const requiredMessage = "Field is a required";
  const schema = yup
    .object()
    .shape({
      Name: yup.string().trim().required(requiredMessage),
      Relation: yup.string().trim().required(requiredMessage),
      Age: yup.number().required(requiredMessage),
      Gender: yup.string().required("Gender Required"),
      BloodGroup: yup.string().required("BloodGroup Required"),
    })
    .required();
  const onSubmit = async (data) => {
    if (data.FamilyId === undefined) {
      await WebService({
        endPoint: "FamilyDetails/Create",
        body: data,
        dispatch,
      });
    } else {
      await WebService({
        endPoint: `FamilyDetails/Update/${data.FamilyId}`,
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
          {(Info.FamilyDetails.FamilyId || 0) === 0
            ? "Add Family Details"
            : "Edit Family Details"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={Info.FamilyDetails}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <div>
          <Modal.Body className="p-4">
            <div className="row">
              <div className="col-md-12">
                <FormInputText
                  label="Name"
                  name="Name"
                  type="text"
                  isRequired="true"
                />
              </div>
              <div className="col-md-12">
                <FormInputText
                  label="Relation"
                  name="Relation"
                  type="text"
                  isRequired="true"
                />
              </div>
              <div className="col-md-12">
                <FormInputText
                  label="Age"
                  name="Age"
                  type="number"
                  isRequired="true"
                />
              </div>
              <div className="col-md-12">
                <FormInputDropdown
                  name="Gender"
                  ddOpt={GenderData}
                  label="Gender"
                  isRequired="true"
                ></FormInputDropdown>
              </div>
              <div className="col-md-12">
                <FormInputDropdown
                  name="BloodGroup"
                  ddOpt={BloodGroupData}
                  label="BloodGroup"
                  isRequired="true"
                ></FormInputDropdown>
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
              {(Info.FamilyDetails.FamilyId || 0) === 0
                ? "Submit"
                : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditFamilyDetails);
