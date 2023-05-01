import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText, FormInputDropdown } from "../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditBankDetails = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ BankDetails: {} });
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        endPoint: `FinanceTemplate/Fetch/${id || 0}`,
        dispatch,
      });
      data.user = data.user.map((v) => {
        return {
          value: v.EmployeeId || "" || null || undefined,
          text: v.FullName,
        };
      });
      data.status = data.status.map((v) => {
        return {
          value: v.StatusId || "" || null || undefined,
          text: v.Status,
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
      BankName: yup.string().trim().required(requiredMessage),
      BankAccountNo: yup.number().required(requiredMessage),
      NameInAccount: yup.string().trim().required(requiredMessage),
      IFSCCode: yup.string().trim().required(requiredMessage),
      EmployeeId: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    console.log(data);
    if (data.FinanceId === undefined) {
      await WebService({
        endPoint: "FinanceTemplate/Create",
        body: data,
        dispatch,
      });
    } else {
      await WebService({
        endPoint: `FinanceTemplate/Update/${data.FinanceId}`,
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
          {(data.FinanceId || 0) === 0
            ? "Add Bank Details"
            : "Edit Bank Details"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.finance}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <div>
          <Modal.Body className="p-4">
            <div className="row">
              <div className="col-md-12">
                <FormInputDropdown
                  name="EmployeeId"
                  ddOpt={data.user}
                  label="Select User"
                  isRequired="true"
                ></FormInputDropdown>
              </div>
              <div className="col-md-12">
                <FormInputText
                  label="Bank Name"
                  name="BankName"
                  type="text"
                  isRequired="true"
                />
              </div>
              <div className="col-md-12">
                <FormInputText
                  label="Bank Account Number"
                  name="BankAccountNo"
                  type="text"
                  isRequired="true"
                />
              </div>
              <div className="col-md-12">
                <FormInputText
                  label="Name In Account"
                  name="NameInAccount"
                  type="text"
                  isRequired="true"
                />
              </div>
              <div className="col-md-12">
                <FormInputText
                  label="IFSC Code"
                  name="IFSCCode"
                  type="text"
                  isRequired="true"
                />
              </div>
              <div className="col-md-12">
                <FormInputText
                  label="PF Account Number"
                  name="PFAccountNo"
                  type="text"
                />
              </div>
              <div className="col-md-12">
                <FormInputText
                  label="PF UAN Number"
                  name="PFUANNo"
                  type="text"
                />
              </div>
              <div className="col-md-12">
                <FormInputDropdown
                  name="StatusId"
                  ddOpt={data.status}
                  label="Select Status"
                ></FormInputDropdown>
              </div>
            </div>
          </Modal.Body>
        </div>
        <hr />
        <div className="row col-md-12 p-3 m-2  mb-4">
          <div className="col-6 mt-2">
            <Button
              className="p-2 radius bg-light text-dark rounded btn-md w-75 col-4"
              id="btnBankDetailsModelClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
              id="btnBankDetailsSubmit"
              type="submit"
            >
              {(data.FinanceId || 0) === 0 ? "Submit" : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditBankDetails);
