import React from 'react';

function ForgetPasswardComponent() {
  return (
    <div className='container'>
        <div className="row mt-4 mb-4">
            <div className="col-md-6 text-center">
                <img className="img-thumbnail border-0" src="logo512.png" alt="thumbnail img" />
            </div>
            <div className='col-md-6 rounded bg-light p-4'>
                <h1 className="col-md-12 font-weight-normal">Forget Password</h1>
                <form action='' method='POST'>

                    <div className="question question-parent col-md-12 mb-4 mt-4">
                        <label className="form-label" >Enter Email</label>
                        <div className="question-input">
                            <input className="form-control" id="Email" placeholder='email@wisesoftwaresolutions.com' />
                        </div>
                    </div>
                    <div className="col-md-12 mt-4">
                        <button id="SubmitBtn" className="btn btn-primary">Submit</button>
                    </div>

                </form>
            </div>
        </div>
    </div>
  );
}

export default ForgetPasswardComponent;
