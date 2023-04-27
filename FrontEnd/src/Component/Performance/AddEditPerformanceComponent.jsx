import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText, FormInputDropdown } from "../Form";
import * as yup from "yup";
import { format } from "date-fns";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditPerformanceComponent = (prop, ref) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ performance: {} });
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        endPoint: `Performance/Fetch/${id || 0}`,
      });
      if ((data?.performance?.FromDate || "") !== "")
        data.performance.FromDate = format(
          new Date(data.performance.FromDate),
          "yyyy-MM-dd"
        );
      if ((data?.performance?.ToDate || "") !== "")
        data.performance.ToDate = format(
          new Date(data.performance.ToDate),
          "yyyy-MM-dd"
        );
      data.users = data.users.map((v) => {
        return {
          value: v.UserID,
          text: v.FullName,
        };
      });
      // console.log(data);
      setData(data);
      setShow(true);
    },
  }));
  const handleClose = () => setShow(false);
  const requiredMessage = "Field is a required";
  const ratingRangeErrorMessage = "Range between 1 to 5";
  const schema = yup
    .object()
    .shape({
      KeyRatingAria: yup.string().trim().required(requiredMessage),
      EmployeeDescription: yup.string().trim().required(requiredMessage),
      FromDate: yup.string().trim().required(requiredMessage),
      ToDate: yup.string().trim().required(requiredMessage),
      ManagerDescription: yup.string().trim().required(requiredMessage),
      EmployeeRating: yup
        .number()
        .required(requiredMessage)
        .min(1, ratingRangeErrorMessage)
        .max(5, ratingRangeErrorMessage),
      FinalRating: yup
        .number()
        .required(requiredMessage)
        .min(1, ratingRangeErrorMessage)
        .max(5, ratingRangeErrorMessage),
      ManagerRating: yup
        .number()
        .required(requiredMessage)
        .min(1, ratingRangeErrorMessage)
        .max(5, ratingRangeErrorMessage),
      UserId: yup.string().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    await WebService({ endPoint: "Performance/Submit", body: data });
    handleClose();
    prop.callBackEvent();
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {(data.performance.PerformanceId || 0) === 0 ? "Add" : "Edit"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.performance}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body>
          <FormInputText
            label="From Date"
            name="FromDate"
            type="date"
            autoFocus
          />
          <FormInputText label="To Date" name="ToDate" type="date" />
          <FormInputText
            label="Key Rating Aria"
            name="KeyRatingAria"
            type="text"
          />
          <FormInputText
            name="EmployeeDescription"
            label="Employee Description"
            as="textarea"
            rows="3"
          />
          <FormInputText
            name="ManagerDescription"
            label="Manager Description"
            as="textarea"
            rows="3"
          />

          <FormInputText
            label="Employee Rating"
            name="EmployeeRating"
            type="number"
          />
          <FormInputText
            label="Manager Rating"
            name="ManagerRating"
            type="number"
          />
          <FormInputText
            label="Final Rating"
            name="FinalRating"
            type="number"
          />
          <FormInputDropdown
            name="UserId"
            ddOpt={data.users}
            label="User"
          ></FormInputDropdown>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditPerformanceComponent);
