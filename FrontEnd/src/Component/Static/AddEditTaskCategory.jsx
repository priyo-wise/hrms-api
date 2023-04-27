import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText, FormInputDropdown } from "../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import _, { sortBy } from "underscore";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditTask = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({});
  const [typeOptions, setTypeOptions] = useState([]);
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      setTypeOptions(
        await WebService({
          dispatch,
          endPoint:
            "CommonUtility/tasktype?select=TaskTypeId,DisplayDescription",
        }).then((c) =>
          sortBy(c ?? [], (s) => s.DisplayDescription).map((m) => {
            return {
              value: m.TaskTypeId,
              text: m.DisplayDescription,
            };
          })
        )
      );
      setData(
        await WebService({
          endPoint: `CommonUtility/taskcategorymaster?where=TaskCategoryId eq ${id || 0}`,
          dispatch,
        }).then(c=>c.length>0?c[0]:{})
      );
      setShow(true);
    },
  }));
  const handleClose = () => setShow(false);
  const requiredMessage = "This is a required field";
  const schema = yup
    .object()
    .shape({
      TaskCategoryName: yup.string().trim().required(requiredMessage),
      TaskTypeId: yup
        .number()
        .typeError(requiredMessage)
        .required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    var endPoint = "CommonUtility/taskcategorymaster";
    var method = "POST";
    if ((data.TaskCategoryId ?? 0) > 0) {
      endPoint += `?TaskCategoryId=${data.TaskCategoryId}`;
      method = "PUT";
    }
    await WebService({
      dispatch,
      endPoint,
      method,
      body: _.omit(data, "TaskCategoryId"),
    });
    handleClose();
    prop.callBackEvent();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {(data.TaskCategoryId || 0) === 0
            ? "Add Task-Category"
            : "Edit Task-Category"}
        </Modal.Title>
      </Modal.Header>
      <Form defaultValues={data} onSubmit={onSubmit} validationSchema={schema}>
        <Modal.Body className="p-4">
          <Row>
            <Col md={12}>
              <FormInputDropdown
                label="Type"
                name="TaskTypeId"
                className="form-control"
                ddOpt={typeOptions}
                isRequired="true"
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FormInputText
                label="Task Category Name"
                name="TaskCategoryName"
                type="text"
                className="form-control"
                isRequired="true"
              />
            </Col>
          </Row>
        </Modal.Body>
        <hr />
        <div className="row col-md-12 p-3 m-2  mb-4">
          <div className="col-6 mt-2">
            <Button
              className="p-2 radius bg-light text-dark rounded btn-md w-75 col-4"
              id="btnTaskModelClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
              id="btnTaskSubmit"
              type="submit"
            >
              {(data.TaskCategoryId || 0) === 0 ? "Submit" : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditTask);
