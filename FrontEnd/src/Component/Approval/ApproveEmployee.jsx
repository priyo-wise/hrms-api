import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText } from "../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import Table from "react-bootstrap/Table";

const { forwardRef, useState, useImperativeHandle } = React;
const ApproveEmployee = (prop, ref) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [records, setRecords] = useState();
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const details = await WebService({
        endPoint: `registration/Fetch/${id || 0}`,
        dispatch,
      });
      setRecords(details);
      setShow(true);
    },
  }));
  const handleClose = () => setShow(false);

  const fnApprove = async (id) => {
    let data = {
      EmployeeId: id,
      StatusId: 3,
    };
    console.log(data);
    await WebService({
      endPoint: "registration/EmployeeStatus",
      body: data,
      dispatch,
    });
    handleClose();
  };
  const fnReject = async (id) => {
    let data = {
      EmployeeId: id,
      StatusId: 4,
    };
    await WebService({
      endPoint: "registration/EmployeeStatus",
      body: data,
      dispatch,
    });
    handleClose();
  };
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcente"
      centered
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title></Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Table className="responsive striped hover">
            <thead>
              <tr>
                <th>
                  <h6>Full Name</h6>
                </th>
                <th>
                  <h6>Father Name</h6>
                </th>
                <th>
                  <h6>Mother Name</h6>
                </th>
                <th>
                  <h6>Permanent Address</h6>
                </th>
                <th>
                  <h6>Communication Address</h6>
                </th>
              </tr>
            </thead>
            <tbody>
              {records?.map((records) => (
                <tr key={records.EmployeeId}>
                  <td>{records.FullName}</td>
                  <td>{records.FatherName}</td>
                  <td>{records.MotherName}</td>
                  <td>{records.PermanentAddress}</td>
                  <td>{records.CommunicationAddress}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Table className="responsive striped hover">
            <thead>
              <tr>
                <th>
                  <h6>Date of Birth</h6>
                </th>
                <th>
                  <h6>Emergency Phone</h6>
                </th>
                <th>
                  <h6>Qualifications</h6>
                </th>
                <th>
                  <h6>Work Location</h6>
                </th>
                <th>
                  <h6>PAN No</h6>
                </th>
              </tr>
            </thead>
            <tbody>
              {records?.map((records) => (
                <tr key={records.EmployeeId}>
                  <td>{records.DOB}</td>
                  <td>{records.EmergencyPhone}</td>
                  <td>{records.Qualifications}</td>
                  <td>{records.WorkLocation}</td>
                  <td>{records.PANNo}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <hr />
        <div className="row m-3 mb-4">
          <div className="col-6 mt-2">
            <Button
              className="p-2 radius bg-light text-dark rounded btn-md w-75 col-4"
              id="btnApproveEmpReject"
              onClick={() => fnReject(records[0].EmployeeId)}
            >
              Decline
            </Button>
          </div>
          <div className="col-6 text-end mt-2">
            <Button
              className=" btn btn-primary  p-2 radius text-light rounded btn-md w-75 col-4"
              id="btnApproveEmp"
              onClick={() => fnApprove(records[0].EmployeeId)}
            >
              Approve
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default forwardRef(ApproveEmployee);
