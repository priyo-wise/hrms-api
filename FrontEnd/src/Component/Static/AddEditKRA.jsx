import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText } from "../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";

const apiUrl = "CommonUtility/staticKRA";
const { forwardRef, useState, useImperativeHandle } = React;
const AddEditKRA = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ KeyRating: {} });
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = {
        KeyRating: await WebService({
          endPoint: `${apiUrl}?where=KRAId eq ${id || 0}`,
          dispatch,
        }).then((c) => (c.length > 0 ? c[0] : {})),
      };
      setData(data);
      setShow(true);
    },
  }));
  const handleClose = () => setShow(false);
  const requiredMessage = "This is a required field";
  const schema = yup
    .object()
    .shape({
      KRAShortDescription: yup.string().trim().required(requiredMessage),
      KRADescription: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    if ((data.KRAId??0) === 0) {
      await WebService({
        endPoint: apiUrl,
        body: data,
        dispatch,
      });
    } else {
      await WebService({
        endPoint: `${apiUrl}?KRAId=${data.KRAId}`,
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
          {(data.KeyRating.KRAId || 0) === 0
            ? "Add Key Rating"
            : "Edit Key Rating"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.KeyRating}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-12">
              <FormInputText
                label="Short Description"
                name="KRAShortDescription"
                type="text"
                maxLength={10}
                isRequired="true"
              />
            </div>
            <div className="col-md-12">
              <FormInputText
                name="KRADescription"
                label="Description"
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
              id="btnKRAModelClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
              id="btnKRASubmit"
              type="submit"
            >
              {(data.KeyRating.KRAId || 0) === 0 ? "Submit" : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditKRA);
