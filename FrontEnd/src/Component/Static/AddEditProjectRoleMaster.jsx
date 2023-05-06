import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText, FormInputDropdown } from "../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import _, { map } from "underscore";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditProjectRoleMaster = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ ProjectRoleMaster: {} });
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = {
        ProjectRoleMaster: await WebService({
          endPoint: `CommonUtility/static_project_roles?where=ProjectRoleId eq ${
            id || 0
          }`,
          dispatch,
        }).then(c=>c.length>0?c[0]:{}),
        parent: await WebService({
          dispatch,
          endPoint: `CommonUtility/static_project_roles?where=ProjectRoleId ne ${id || 0}`,
        }).then((c) =>
          [{}].concat(
            map(c ?? [], (m) => ({
              value: m.ProjectRoleId,
              text: m.DisplayDescription,
            }))
          )
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
      DisplayDescription: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    if (data.ProjectRoleId === undefined) {
      await WebService({
        endPoint: "CommonUtility/static_project_roles",
        body: data,
        dispatch,
      });
    } else {
      await WebService({
        endPoint: `CommonUtility/static_project_roles?ProjectRoleId=${data.ProjectRoleId}`,
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
          {(data.ProjectRoleMaster.ProjectRoleId || 0) === 0 ? "Add Project Role" : "Edit Project Role"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.ProjectRoleMaster}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-12">
              <FormInputText
                label="Project Role"
                name="DisplayDescription"
                type="text"
                isRequired="true"
              />
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
              {(data.ProjectRoleMaster.ProjectRoleId || 0) === 0 ? "Submit" : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditProjectRoleMaster);
