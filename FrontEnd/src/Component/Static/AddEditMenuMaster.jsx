import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText, FormInputDropdown } from "../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import _ from "underscore";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditMenuMaster = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ MenuMaster: {} });
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        endPoint: `MenuMaster/Fetch/${id || 0}`,
        dispatch,
      });
      data.parent = [{ value: null, text: "" }].concat(
        _.map(data.parent, (m) => {
          return {
            value: m.MenuId,
            text: m.MenuText,
          };
        })
      );
      setData(data);
      setShow(true);
    },
  }));
  const handleClose = () => setShow(false);
  const requiredMessage = "This is a required field";
  const schema = yup
    .object()
    .shape({
      MenuText: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    if (data.MenuId === undefined) {
      await WebService({
        endPoint: "MenuMaster/Create",
        body: data,
        dispatch,
      });
    } else {
      await WebService({
        endPoint: `MenuMaster/Update/${data.MenuId}`,
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
          {(data.MenuMaster.MenuId || 0) === 0 ? "Add Menu" : "Edit Menu"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.MenuMaster}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-12">
              <FormInputText
                label="Menu Text"
                name="MenuText"
                type="text"
                isRequired="true"
              />
            </div>
            <div className="col-md-12">
              <FormInputText label="Route" name="Route" type="text" />
            </div>
            <div className="col-md-12">
              <FormInputText label="Icon" name="Icon" type="text" />
            </div>
            <div className="col-md-12">
              <FormInputDropdown
                name="ParentId"
                ddOpt={data?.parent ?? []}
                label="Parent"
              ></FormInputDropdown>
            </div>
          </div>
        </Modal.Body>

        <hr />
        <div className="row col-md-12 p-3 m-2  mb-4">
          <div className="col-6 mt-2">
            <Button
              className="p-2 radius bg-light text-dark rounded btn-md w-75 col-4"
              id="btnMenuMasterModelClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
              id="btnMenuMasterSubmit"
              type="submit"
            >
              {(data.MenuMaster.MenuId || 0) === 0 ? "Submit" : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditMenuMaster);
