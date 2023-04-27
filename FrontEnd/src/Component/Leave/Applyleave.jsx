import React from "react";
import "./Leave.css";
import { WebService } from "../../Services/WebService";

const applyleave = () => {
  const SubmitData = async (e) => {
    e.preventDefault();
    const { EmployeeName, LeaveType, FromDate, ToDate, Reason } =
      e.target.elements;
    let data = {
      EmployeeName: EmployeeName.value,
      LeaveType: LeaveType.value,
      FromDate: FromDate.value,
      ToDate: ToDate.value,
      Reason: Reason.value,
    };
    console.log(data);
    WebService({
      endPoint: "Applyleave/create",
      method: "POST",
      body: data,
    }).then((response) => {
      console.log(response);
    });
  };
  return (
    <div className="h-screen flex-grow-1 overflow-y-lg-auto">
      <div className="container">
        <div className="row mb-4 mt-5 justify-content-center">
          <div className="col-md-7 success bgl ml-5 p-4">
            <form onSubmit={SubmitData}>
              <div className="form">
                <div className="row col-12 d-flex justify-content-center text-white">
                  <h1 className="head-t">Apply Leave</h1>
                </div>
                <div className="form-body">
                  <label className="form__label">Employee Name</label>
                  <div className="col-md-12">
                    <input
                      type="text"
                      className="col-md-12 field-col pb-2 pt-2"
                      id="EmployeeName"
                      name="EmployeeName"
                    ></input>
                  </div>
                  <div className="mt-3">
                    <label className="form__label mb-2">leave Type</label>
                    <div className="col-md-12">
                      <select
                        className="col-md-12 field-col pb-2 pt-2"
                        id="LeaveType"
                        name="LeaveType"
                      >
                        <option></option>
                        <option>Sick Leave</option>
                        <option>Casual leave</option>
                        <option>Half-day leave</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="form__label mb-2">From</label>
                    <div className="col-md-12">
                      <input
                        type="date"
                        className="col-md-12 field-col pb-2 pt-2 datePicker picker__input"
                        id="FromDate"
                        name="FromDate"
                      ></input>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="form__label mb-2">TO</label>
                    <div className="col-md-12">
                      <input
                        type="Date"
                        className="col-md-12 field-col pb-2 pt-2"
                        id="ToDate"
                        name="ToDate"
                      ></input>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="form__label mb-2">Reason</label>
                    <div className="col-md-12">
                      <textarea
                        className="col-md-12 field-col pb-2 pt-2"
                        id="Reason"
                        name="Reason"
                      ></textarea>
                    </div>
                  </div>
                  <div className=" row d-flex justify-content-center mt-5 align-content-center ">
                    {" "}
                    <button
                      href="#"
                      className="b-app p-2 radius text-light rounded btn-md w-25 col-4"
                    >
                      Submit
                    </button>{" "}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default applyleave;
