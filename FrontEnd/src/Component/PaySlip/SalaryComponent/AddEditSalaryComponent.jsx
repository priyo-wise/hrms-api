import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../../Services/WebService";
import { Form, FormInputText, FormInputDropdown } from "../../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import "./../Payslip.css";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditComponent = (prop, ref) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({});
  const dispatch = useDispatch();
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        dispatch,
        endPoint: `SalaryComponent/${id || 0}`,
      }).then((c) => (c.length > 0 ? c[0] : {}));
      setData(data);
      setShow(true);
    },
  }));
  const handleClose = () => setShow(false);
  const requiredMessage = "This is a required field";
  const schema = yup
    .object()
    .shape({
      EarningOrDeductionName: yup.string().trim().required(requiredMessage),
      EarningOrDeductionType: yup.string().trim().required(requiredMessage),
      PreTaxORPostTax: yup
        .string()
        .when("EarningOrDeductionType", (type, passSchema) =>
          type[0] === "Deduction"
            ? passSchema.required(requiredMessage)
            : passSchema.notRequired()
        ),
    })
    .required();
  const onSubmit = async (data) => {
    if (data.EarningOrDeductionType === "Earning") data.PreTaxORPostTax = null;
    let endPoint = "SalaryComponent";
    let method = "POST";
    if ((data.SalaryComponentsId ?? 0) !== 0) {
      endPoint = `SalaryComponent/${data.SalaryComponentsId}`;
      method = "PUT";
    }
    await WebService({ dispatch, endPoint, body: data, method });
    handleClose();
    prop.callBackEvent();
  };
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter "
      centered
      show={show}
      onHide={handleClose}
      className="container-fluid"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {(data.SalaryComponentsId || 0) === 0
            ? "Add Salary Component"
            : "Edit Salary Component"}
        </Modal.Title>
      </Modal.Header>
      <Form defaultValues={data} onSubmit={onSubmit} validationSchema={schema}>
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-6">
              <FormInputText
                label="Name"
                name="EarningOrDeductionName"
                type="text"
                isRequired="true"
              />
            </div>
            <div className="col-md-6">
              <FormInputDropdown
                name="EarningOrDeductionType"
                ddOpt={[
                  { value: "Earning", text: "Earning" },
                  { value: "Deduction", text: "Deduction" },
                ]}
                label="Type"
                className="form-control"
                isRequired="true"
                setValue={(v) => {
                  if ((data?.EarningOrDeductionType ?? "") !== v) {
                    data.PreTaxORPostTax = null;
                  }
                  setData({ ...data, EarningOrDeductionType: v });
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              {(data?.EarningOrDeductionType ?? "") === "Deduction" && (
                <>
                  <FormInputDropdown
                    name="PreTaxORPostTax"
                    ddOpt={[
                      { value: "Pre Tax", text: "Pre-Tax" },
                      { value: "Post Tax", text: "Post-Tax" },
                    ]}
                    label="Tax Type"
                    className="form-control"
                    isRequired="true"
                  />
                </>
              )}
            </div>
            {/* <div className="col-md-6">
              
              <FormCheckInput label="Status" name="Status" type="checkbox" />
            </div> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-danger"
            className="me-4"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button variant="outline-primary" type="submit">
            {(data.SalaryComponentsId || 0) === 0 ? "Submit" : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditComponent);
