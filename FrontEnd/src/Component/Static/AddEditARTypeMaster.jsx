import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText, FormInputDropdown } from "../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import SweetAlert from 'sweetalert2'

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditARTypeMaster = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ ARType: {} });
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        endPoint: `ARTypeMaster/Fetch/${id || 0}`,
        dispatch,
      });
      // data.Company = data.Company.map((v) => {
      //   return {
      //     value: v.id,
      //     text: v.name,
      //   };
      // });
      
      data.SalaryComponent = data.SalaryComponent.map((v) => {
        return {
          value: v.SalaryComponentsId,
          text: v.EarningOrDeductionName,
        };
      });
      setData(data);
      setShow(true);
    },
  }));
  const handleClose = () => setShow(false);
  const requiredMessage = "Field is a required";
  const schema = yup
    .object()
    .shape({
     // KRAShortDescription: yup.string().trim().required(requiredMessage),
     // KRADescription: yup.string().trim().required(requiredMessage),
    })
    .required();
  
    const successAlert = (res) => {
        SweetAlert.fire({  
            text: res,
          }); 
    }
    
  const onSubmit = async (data) => {
    //alert(JSON.stringify(data));
    const responsedata = await WebService({ endPoint: "ARTypeMaster/Submit", body: data, dispatch });
    successAlert(responsedata);    
    handleClose();
    prop.callBackEvent();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {(data.ARType.ARTypeId || 0) === 0
            ? "Add AR Type"
            : "Edit AR Type"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.ARType}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
      <Modal.Body className="p-4">
            <div className="row mt-1">
              <FormInputDropdown
                name="SalaryComponentId"
                ddOpt={data.SalaryComponent}
                label="Salary Component"
              ></FormInputDropdown>
            </div>
            <div className="row mt-1">
              <FormInputText
                name="Code"
                label="Code"
                type="text"
              />
            </div>
            <div className="row mt-1">
              <FormInputText
                label="Display Description"
                name="DisplayDescription"
                type="text"
              />
            </div>            
        </Modal.Body>
        <hr />
        <div className="row col-md-12 p-3 m-2  mb-4">
          <div className="col-6 mt-2">
            <Button
              className="p-2 radius bg-light text-dark rounded btn-md w-75 col-4"
              id="btnARTypeModelClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
              id="btnARTypeSubmit"
              type="submit"
            >
              {(data.ARType.ARTypeId || 0) === 0 ? "Submit" : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditARTypeMaster);
