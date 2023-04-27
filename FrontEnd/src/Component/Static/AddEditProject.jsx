import React, { useContext, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import * as Form from "../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { each, extend, extendOwn, findWhere, map, pick } from "underscore";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditProject = (prop, ref) => {
  const formRef = useRef();
  const cloneData = (ds) => JSON.parse(JSON.stringify(ds));
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({});
  const [taskType, setTaskType] = useState([]);
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        dispatch,
        endPoint: `CommonUtility/projectmaster?where=ProjectId eq ${id}`,
      }).then((ds) => (ds.length > 0 ? ds[0] : {}));
      const s1 = await WebService({
        dispatch,
        endPoint: `CommonUtility/project_budget?where=ProjectId eq ${id}`,
      });
      extendOwn(data, {
        budget: map(cloneData(taskType), (m) =>
          extend(m, {
            Hours:
              findWhere(cloneData(s1), { TaskTypeId: m.TaskTypeId })?.Hours ??
              0,
          })
        ),
      });
      setData(data);
      setShow(true);
    },
  }));
  const handleClose = () => setShow(false);
  const requiredMessage = "This is a required field";
  const schema = yup.object({
    ProjectName: yup.string().trim().required(requiredMessage),
    BudgetTotalHour: yup
      .number()
      .typeError(requiredMessage)
      .label("Hour")
      .required(requiredMessage)
      .min(0),
    budget: yup.array().of(
      yup.object().shape({
        Hours: yup
          .number()
          .typeError(requiredMessage)
          .required(requiredMessage)
          .min(0),
      })
    ),
  });
  const onSubmit = async (data) => {
    var opt={endPoint:"CommonUtility/projectmaster", dispatch, body:data};
    if((data?.ProjectId ?? 0) === 0){
      extendOwn(data,{ProjectId:await WebService(opt)});
    }else{
      opt.method="PUT";
      opt.endPoint+=`?ProjectId=${data.ProjectId}`;
      await WebService(opt);
    }
    await WebService({dispatch,endPoint:`CommonUtility/project_budget?ProjectId=${data.ProjectId}`, method:"DELETE"});
    each(data.budget,async m=>{
      m.ProjectId=data.ProjectId;
      await WebService({dispatch,endPoint:"CommonUtility/project_budget",body:pick(m,["ProjectId","TaskTypeId","Hours"])});
    });
    handleClose();
    prop.callBackEvent();
  };
  useEffect(() => {
    WebService({
      dispatch,
      endPoint: "CommonUtility/tasktype?select=TaskTypeId, DisplayDescription",
    }).then((ds) => setTaskType(ds));
  }, []);
  var formContent = (
    <Form.Form
      defaultValues={data}
      onSubmit={onSubmit}
      validationSchema={schema}
      id="frm_project"
      ref={formRef}
    >
      <Row>
        <Col md={12}>
          <Form.FormInputText
            label="Project Name"
            name="ProjectName"
            type="text"
            className="form-control"
            isRequired="true"
          />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Form.FormInputText
            label="Total Budget"
            name="BudgetTotalHour"
            type="number"
            className="form-control"
            isRequired="true"
            min={0}
          />
        </Col>
      </Row>
      <Form.FormFields name="budget">
        <Row>
          <Col md={12}>
            <Form.FormInputText
              dynamicLabel="DisplayDescription"
              name="Hours"
              type="number"
              className="form-control"
              isRequired="true"
              min={0}
            />
          </Col>
        </Row>
      </Form.FormFields>
    </Form.Form>
  );
  var footerComponent = (
    <>
      <div className="row col-md-12 p-3 m-2  mb-4">
        <div className="col-6 mt-2">
          <Button
            id="btnProjectModelClose"
            className="p-2 radius bg-light text-dark rounded btn-md w-75 col-4"
            onClick={handleClose}
          >
            Close
          </Button>
        </div>
        <div className="col-6 text-end mt-2">
          <Button
            className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
            id="btnProjectSubmit"
            type="submit"
            form="frm_project"
          >
            {(data?.ProjectId ?? 0) === 0 ? "Submit" : "Save Changes"}
          </Button>
        </div>
      </div>
    </>
  );
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {(data?.ProjectId ?? 0) === 0 ? "Add Project" : "Edit Project"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">{formContent}</Modal.Body>
      <hr />
      {footerComponent}
    </Modal>
  );
};

export default forwardRef(AddEditProject);
