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
const AddEditRoles = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ Roles: {} });
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = {
        Roles: await WebService({
          endPoint: `CommonUtility/staticroles?where=RoleId eq ${id || 0}`,
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
      RoleName: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    if (data.RoleId === undefined) {
      await WebService({ endPoint: "CommonUtility/staticroles", body: data, dispatch });
    } else {
      await WebService({
        endPoint: `CommonUtility/staticroles?RoleId=${data.RoleId}`,
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
          {(data.Roles.RoleId || 0) === 0 ? "Add Role" : "Edit Role"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.Roles}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-12">
              <FormInputText
                label="Role Name"
                name="RoleName"
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
              id="btnRoleModelClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
              id="btnRoleSubmit"
              type="submit"
            >
              {(data.Roles.RoleId || 0) === 0 ? "Submit" : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};
export default forwardRef(AddEditRoles);
