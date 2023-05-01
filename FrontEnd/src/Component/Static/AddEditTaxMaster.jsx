import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText, FormInputDropdown } from "../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditTaxMaster = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ TaxMaster: {} });
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        endPoint: `TaxMaster/Fetch/${id || 0}`,
        dispatch,
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
      PaySlipTextForTax: yup.string().trim().required(requiredMessage),
      TaxDescription: yup.string().trim().required(requiredMessage),
      PercentageOrFixed: yup.string().trim().required(requiredMessage),
      NumberOrAmount: yup.string().trim().required(requiredMessage),
      FrequencyMonthlyYearly: yup.string().trim().required(requiredMessage),
      DeductionType: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    if (data.TaxId === undefined) {
      await WebService({ endPoint: "TaxMaster/Create", body: data, dispatch });
    } else {
      await WebService({
        endPoint: `TaxMaster/Update/${data.TaxId}`,
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
          {" "}
          {(data.TaxMaster.TaxId || 0) === 0 ? "Add Tax" : "Edit Tax"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.TaxMaster}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-12">
              <FormInputText
                label="PaySlip Text For Tax"
                name="PaySlipTextForTax"
                type="text"
                isRequired="true"
              />
            </div>
            <div className="col-md-12">
              <FormInputText
                label="Tax Description"
                name="TaxDescription"
                type="text"
                isRequired="true"
              />
            </div>
            <div className="col-md-12">
              <FormInputText
                label="Percentage Or Fixed"
                name="PercentageOrFixed"
                type="text"
                isRequired="true"
              />
            </div>
            <div className="col-md-12">
              <FormInputText
                label="Amount"
                name="NumberOrAmount"
                type="text"
                isRequired="true"
              />
            </div>
            <div className="col-md-12">
              <FormInputText
                label="Frequency Monthly Yearly"
                name="FrequencyMonthlyYearly"
                type="text"
                isRequired="true"
              />
            </div>
            <div className="col-md-12">
              <FormInputText
                label="Deduction Type"
                name="DeductionType"
                type="text"
                isRequired="true"
              />
            </div>
          </div>
        </Modal.Body>

        <hr />
        <div className="row col-md-12 p-3 m-2  mb-4">
          <div className="col-6 mt-2">
            <Button
              className="p-2 radius bg-light text-dark rounded btn-md w-75 col-4"
              id="btnTaxMasterModelClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
              id="btnTaxMasterSubmit"
              type="submit"
            >
              {(data.TaxMaster.TaxId || 0) === 0 ? "Submit" : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditTaxMaster);
