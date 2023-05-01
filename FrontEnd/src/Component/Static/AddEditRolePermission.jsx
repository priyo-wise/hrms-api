import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputDropdown } from "../Form";
import { useDispatch } from "react-redux";
import * as yup from "yup";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditRolePermission = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ RolePermission: {} });
  useImperativeHandle(ref, () => ({
    openModal: async () => {
      const data = await WebService({
        endPoint: `RolePermission/Fetch1`,
        dispatch,
      });
      data.permission = data.permission.map((v) => {
        return {
          value: v.PermissionId || "" || null || undefined,
          text: v.Permission,
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
      PermissionId: yup.string().trim().required(requiredMessage),
      RoleId: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    await WebService({
      endPoint: "RolePermission/Create",
      body: data,
      dispatch,
    });

    handleClose();
    prop.callBackEvent();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Role-Permission</Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.RolePermission}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-12">
              <FormInputDropdown
                name="PermissionId"
                ddOpt={data.permission}
                label="Select Permission"
                isRequired="true"
              ></FormInputDropdown>
            </div>
            <div className="col-md-12">
              <FormInputDropdown
                name="RoleId"
                ddOpt={data.roles}
                label="Select Role"
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
              id="btnRolePermissionModelClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
              id="btnRolePermissionSubmit"
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
export default forwardRef(AddEditRolePermission);
