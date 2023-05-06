import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText, FormInputDropdown } from "../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { StandardConst } from "../../Services/StandardConst";
const requiredMessage = StandardConst.requiredMessage;
const { forwardRef, useState, useImperativeHandle } = React;
const AddEditQualification = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ Qualification: {} });
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = {
        Qualification: await WebService({
          endPoint: `CommonUtility/static_qualification_master?where=QualificationId eq ${id || 0}`,
          dispatch,
        }).then((c) => (c.length > 0 ? c[0] : {})),
      };
      setData(data);
      setShow(true);
    },
  }));
  const handleClose = () => setShow(false);
  const schema = yup
    .object()
    .shape({
      DisplayQualification: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    console.log("Qualication",data);
    if (data.QualificationId === undefined) {
      await WebService({ endPoint: "CommonUtility/static_qualification_master", body: data, dispatch });
    } else {
      await WebService({
        endPoint: `CommonUtility/static_qualification_master?QualificationId=${data.QualificationId}`,
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
        <Modal.Title className="px-2">
          {(data.Qualification.QualificationId || 0) === 0 ? "Add Qualification" : "Edit Qualification"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.Qualification}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-12">
              <FormInputText
                label="Qualification"
                name="DisplayQualification"
                type="text"
                isRequired="true"
              />
            </div>
          </div>
        </Modal.Body>
        <hr />
        <div className="row py-2 m-2  mb-4">
          <div className="col-6 mt-2">
            <Button
              className="p-2 radius bg-light text-dark rounded btn-md w-75 col-4"
              id="btnQualificationModelClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
              id="btnQualificationSubmit"
              type="submit"
            >
              {(data.Qualification.QualificationId || 0) === 0 ? "Submit" : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};
export default forwardRef(AddEditQualification);
