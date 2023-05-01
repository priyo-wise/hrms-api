import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputDropdown } from "../Form";
import { useDispatch } from "react-redux";
import * as yup from "yup";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditMenuRole = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ MenuRole: {} });
  useImperativeHandle(ref, () => ({
    openModal: async () => {
      const data = await WebService({
        endPoint: `MenuRole/Fetch1`,
        dispatch,
      });
      data.menu = data.menu.map((v) => {
        return {
          value: v.MenuId || "" || null || undefined,
          text: v.MenuText,
        };
      });
      data.roles = data.roles.map((v) => {
        return {
          value: v.RoleId || "" || null || undefined,
          text: v.RoleName,
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
      MenuId: yup.string().trim().required(requiredMessage),
      RoleId: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    await WebService({
      endPoint: "MenuRole/Create",
      body: data,
      dispatch,
    });

    handleClose();
    prop.callBackEvent();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Menu-Role</Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.MenuRole}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-12">
              <FormInputDropdown
                name="RoleId"
                ddOpt={data.roles}
                label="Select Role"
                isRequired="true"
              ></FormInputDropdown>
            </div>
            <div className="col-md-12">
              <FormInputDropdown
                name="MenuId"
                ddOpt={data.menu}
                label="Select Menu"
                isRequired="true"
              ></FormInputDropdown>
            </div>
          </div>
        </Modal.Body>
        <hr />
        <div className="row col-md-12 p-3 m-2  mb-4">
          <div className="col-6 mt-2">
            <Button
              className="p-2 radius bg-light text-dark rounded btn-md w-75 col-4"
              id="btnMenuRoleModelClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
              id="btnMenuRoleSubmit"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};
export default forwardRef(AddEditMenuRole);
