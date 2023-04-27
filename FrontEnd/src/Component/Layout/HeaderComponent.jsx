import React from 'react';
import './Header.css'
function HeaderComponent() {
  return (


          <header className="bg-surface-primary border-bottom pt-6">
            <div className="container-fluid">
                <div className="mb-npx">
                    <div className="row align-items-center">
                        <div className="col-sm-6 col-12 mb-4 mb-sm-0">
                         
                            <h1 className="h2 mb-0 ls-tight">Application</h1>
                        </div>
                      
                        <div className="col-sm-6 col-12 text-sm-end mb-4">
                            <div className="mx-n1">
                                <a href="#" className="btn d-inline-flex btn-sm btn-neutral border-base mx-1">
                                    <span className=" pe-2">
                                        <i className="fa fa-pencil"></i>
                                    </span>
                                    <span>Edit</span>
                                </a>
                                <a href="#" className="btn d-inline-flex btn-sm btn-primary mx-1">
                                    <span className=" pe-2">
                                        <i className="fa fa-plus"></i>
                                    </span>
                                    <span>Create</span>
                                </a>
                            </div>
                        </div>
                    </div>
                  
                </div>
            </div>
        </header>


  );
}

export default HeaderComponent;
