import React from "react";

function PaySlipComponent() {
  return (
    <html>
      <div className="container bg-light border rounded">
        <h1>Salary Slip</h1>
        <form onSubmit="">
          <div className="question question-parent col-md-12 mb-4">
            <label>Date</label>
            <div className="question-input">
              <input
                className="form-control"
                type="date"
                id="SalaryDate"
              ></input>
            </div>
          </div>
          <div className="question question-parent col-md-12 mb-4">
            <label>Working Days</label>
            <div className="question-input">
              <input
                className="form-control"
                type="number"
                id="NoWorkingDays"
              ></input>
            </div>
          </div>
          <div className="question question-parent col-md-12 mb-4">
            <label>Un-Paid Days</label>
            <div className="question-input">
              <input
                className="form-control"
                type="number"
                id="UnPaidDays"
              ></input>
            </div>
          </div>
          <div className="question question-parent col-md-12 mb-4">
            <label>Basic Salary</label>
            <div className="question-input">
              <input
                className="form-control"
                type="number"
                id="BasicSalary"
              ></input>
            </div>
          </div>
          <div className="question question-parent col-md-12 mb-4">
            <label>HRA</label>
            <div className="question-input">
              <input className="form-control" type="number" id="HRA"></input>
            </div>
          </div>
          <div className="question question-parent col-md-12 mb-4">
            <label>Medical Allowance</label>
            <div className="question-input">
              <input
                className="form-control"
                type="number"
                id="MedicalAllowance"
              ></input>
            </div>
          </div>
          <div className="question question-parent col-md-12 mb-4">
            <label>Performance Bonus</label>
            <div className="question-input">
              <input
                className="form-control"
                type="number"
                id="PerformanceBonus"
              ></input>
            </div>
          </div>
          <div className="question question-parent col-md-12 mb-4">
            <label>Other Bonus</label>
            <div className="question-input">
              <input
                className="form-control"
                type="number"
                id="OtherBonus"
              ></input>
            </div>
          </div>
          <div className="question question-parent col-md-12 mb-4">
            <label>LTA</label>
            <div className="question-input">
              <input className="form-control" type="number" id="LTA"></input>
            </div>
          </div>
          <div className="question question-parent col-md-12 mb-4">
            <label>Professional Tax</label>
            <div className="question-input">
              <input
                className="form-control"
                type="number"
                id="ProfessionalTax"
              ></input>
            </div>
          </div>
          <div className="question question-parent col-md-12 mb-4">
            <label>TDS</label>
            <div className="question-input">
              <input className="form-control" type="number" id="TDS"></input>
            </div>
          </div>
          <div className="question question-parent col-md-12 mb-4">
            <label>Gross Salary</label>
            <div className="question-input">
              <input
                className="form-control"
                type="number"
                id="GrossSalary"
              ></input>
            </div>
          </div>
          <div className="question question-parent col-md-12 mb-4">
            <label>Net Salary</label>
            <div className="question-input">
              <input
                className="form-control"
                type="number"
                id="NetSalary"
              ></input>
            </div>
          </div>

          <div className="col-md-12 mt-4 text-center">
            <button className="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </html>
  );
}
export default PaySlipComponent;
