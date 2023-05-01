import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../../Services/WebService";
import { Form, FormInputText, FormInputDropdown } from "../../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import SweetAlert from 'sweetalert2'

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditSalaryARInvoice = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ ARInvoice: {} });
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        endPoint: `SalaryARInvoice/Fetch/${id || 0}`,
        dispatch,
      });
      data.ARType = data.ARType.map((v) => {
        return {
          value: v.ARTypeId,
          text: v.DisplayDescription,
        };
      });
      
      data.Employee = data.Employee.map((v) => {
        return {
          value: v.id,
          text: v.name,
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
    const responsedata = await WebService({ endPoint: "SalaryARInvoice/Submit", body: data, dispatch });
    successAlert(responsedata);    
    handleClose();
    prop.callBackEvent();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {(data.ARInvoice.ARInvoiceId || 0) === 0
            ? "Add Salary Invoice"
            : "Edit Salary Invoice"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.ARInvoice}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
      <Modal.Body className="p-4">
            <div className="row mt-1">
              <FormInputDropdown
                name="EmployeeId"
                ddOpt={data.Employee}
                label="Employee Name"
              ></FormInputDropdown>
            </div>
            <div className="row mt-1">
              <FormInputDropdown
                name="ARTypeId"
                ddOpt={data.ARType}
                label="AR Type"
              ></FormInputDropdown>
            </div>
            <div className="row mt-1">
              <FormInputText
                name="TransactionNo"
                label="Transaction No"
                type="number"
              />
            </div>
            <div className="row mt-1">
              <FormInputText
                label="Transaction Date"
                name="TransactionDate"
                type="date"
              />
            </div>
            <div className="row mt-1">
              <FormInputText
                label="Transaction Mode"
                name="TransactionMode"
                type="text"
              />
            </div>
            <div className="row mt-1">
              <FormInputText
                label="Amount"
                name="Amount"
                type="text"
              />
            </div>            
        </Modal.Body>
        <hr />
        <div className="row col-md-12 p-3 m-2  mb-4">
          <div className="col-6 mt-2">
            <Button
              className="p-2 radius bg-light text-dark rounded btn-md w-75 col-4"
              id="btnARInvoiceModelClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
              id="btnARInvoiceSubmit"
              type="submit"
            >
              {(data.ARInvoice.ARInvoiceId || 0) === 0 ? "Submit" : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditSalaryARInvoice);
