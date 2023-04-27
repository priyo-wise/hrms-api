import React from 'react';

function RegistrationComponent() {
  return (
        <div className="container bg-light border rounded">
            <form onSubmit="">
                <div className="question question-parent col-md-12 mb-4">
                    <label>First Name</label>
                    <div className="question-input">
                        <input className="form-control" id="FirstName" />
                    </div>
                </div>
                <div className="question question-parent col-md-12 mb-4">
                    <label className="form-label" >Last Name</label>
                    <div className="question-input">
                        <input className="form-control" id="LastName" />
                    </div>
                </div>

                <div className="col-md-12 mt-4 text-center">
                    <button className="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
  );
}

export default RegistrationComponent;
