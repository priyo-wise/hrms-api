import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText } from "../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { format } from "date-fns";

const apiUrl="CommonUtility/holidaymaster";
const { forwardRef, useState, useImperativeHandle } = React;
const AddEditHolidayMaster = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ HolidayMaster: {} });
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = {
        HolidayMaster: await WebService({
          endPoint: `${apiUrl}?where=HolidayId eq ${id || 0}`,
          dispatch,
        }).then((c) => (c.length > 0 ? c[0] : {})),
      };
      if ((data?.HolidayMaster?.HolidayDate || "") !== "")
        data.HolidayMaster.HolidayDate = format(
          new Date(data.HolidayMaster.HolidayDate),
          "yyyy-MM-dd"
        );
      setData(data);
      setShow(true);
    },
  }));
  const handleClose = () => setShow(false);
  const requiredMessage = "This is a required field";
  const schema = yup
    .object()
    .shape({
      HolidayDate: yup
        .date()
        .typeError(requiredMessage)
        .required(requiredMessage),
      HolidayName: yup.string().trim().required(requiredMessage),
    })
    .required();
  const onSubmit = async (data) => {
    var dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    //data.HolidayDate = format;
    data.HolidayDate = format(
      new Date(data.HolidayDate),
      "yyyy-MM-dd"
    );
    var day = new Date(data.HolidayDate);
    data.HolidayWeekDay = dayNames[day.getDay()];
    if (data.HolidayId === undefined) {
      await WebService({
        endPoint: apiUrl,
        body: data,
        dispatch,
      });
    } else {
      await WebService({
        endPoint: `${apiUrl}?HolidayId=${data.HolidayId}`,
        method: "PUT",
        body: data,
        dispatch,
      });
    }
    console.log("holiday",data);
    handleClose();
    prop.callBackEvent();
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {(data.HolidayMaster.HolidayId || 0) === 0
            ? "Add Holiday"
            : "Edit Holiday"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.HolidayMaster}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-12">
              <FormInputText
                label="Date"
                name="HolidayDate"
                type="date"
                isRequired="true"
                max="2999-12-31"
              />
            </div>
            <div className="col-md-12">
              <FormInputText
                label="Name"
                name="HolidayName"
                type="text"
                isRequired="true"
              />
            </div>
            <div className="col-md-12">
              <FormInputText
                label="Holiday Saka"
                name="HolidaySaka"
                type="text"
              />
            </div>
            <div className="col-md-12">
              <FormInputText
                label="Comments"
                name="HolidayComments"
                as="textarea"
                rows="2"
              />
            </div>
          </div>
        </Modal.Body>

        <hr />
        <div className="row col-md-12 p-3 m-2  mb-4">
          <div className="col-6 mt-2">
            <Button
              className="p-2 radius bg-light text-dark rounded btn-md w-75 col-4"
              id="btnHolidayModelClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
              id="btnHolidaySubmit"
              type="submit"
            >
              {(data.HolidayMaster.HolidayId || 0) === 0
                ? "Submit"
                : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditHolidayMaster);
