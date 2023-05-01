import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText, FormInputDropdown } from "../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import SweetAlert from 'sweetalert2'

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditOfficelocation = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ location: {} });
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        endPoint: `Officelocation/Fetch/${id || 0}`,
        dispatch,
      });
      console.log("company Data",data);
      // data.Company = data.Company.map((v) => {
      //   return {
      //     value: v.id,
      //     text: v.name,
      //   };
      // });
      
      data.Company = data.Company.map((v) => {
        return {
          value: v.CompanyId,
          text: v.CompanyName,
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
    const responsedata = await WebService({ endPoint: "Officelocation/Submit", body: data, dispatch });
    successAlert(responsedata);    
    handleClose();
    prop.callBackEvent();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {(data.location.OfficeLocationId || 0) === 0
            ? "Add Office location"
            : "Edit Office location"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={data.location}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
      <Modal.Body className="p-4">
            <div className="row mt-1">
              <FormInputDropdown
                name="CompanyId"
                ddOpt={data.Company}
                label="Company Name"
              ></FormInputDropdown>
            </div>
            <div className="row mt-1">
              <FormInputText
                name="Location"
                label="Location"
                type="text"
              />
            </div>
            <div className="row mt-1">
              <FormInputText
                label="Address"
                name="Address"
                type="text"
              />
            </div>            
        </Modal.Body>
        <hr />
        <div className="row col-md-12 p-3 m-2  mb-4">
          <div className="col-6 mt-2">
            <Button
              className="p-2 radius bg-light text-dark rounded btn-md w-75 col-4"
              id="btnErrorModelClose"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" b-app  p-2 radius text-light rounded btn-md w-75 col-6"
              id="btnlocationSubmit"
              type="submit"
            >
              {(data.location.OfficeLocationId || 0) === 0 ? "Submit" : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditOfficelocation);
