import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputDropdown } from "../Form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { map } from "underscore";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditUserRole = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ UserRole: {} });
  useImperativeHandle(ref, () => ({
    openModal: async () => {
      const data = {
        roles: await WebService({
          endPoint: "CommonUtility/staticroles?select=RoleId,RoleName",
          dispatch,
        }).then((c) => map(c, (m) => ({ value: m.RoleId, text: m.RoleName }))),
        users: await WebService({
          endPoint: "CommonUtility/employees?select=EmployeeId,FullName",
          dispatch,
        }).then((c) =>
          map(c, (m) => ({ value: m.EmployeeId, text: m.FullName }))
        ),
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
      EmployeeId: yup.string().trim().required(requiredMessage),
      RoleId: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    await WebService({ endPoint: "CommonUtility/userroles", body: data, dispatch });

    handleClose();
    prop.callBackEvent();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add User-Role</Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.UserRole}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-12">
              <FormInputDropdown
                name="EmployeeId"
                ddOpt={data.users}
                label="Select User"
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
              id="btnUserRoleModelClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
              id="btnUserRoleSubmit"
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
export default forwardRef(AddEditUserRole);
