/* #region Import */
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, FormInputText, FormInputFile } from "../Form";
import "../Company/CompanyRegistration.css";
import Button from "react-bootstrap/Button";

import _, { extend, omit, pick } from "underscore";
import { WebService } from "../../Services/WebService";
import FooterComponent from "../Layout/FooterComponent";
import { StandardConst } from "../../Services/StandardConst";
import * as yup from "yup";
import SweetAlert from 'sweetalert2'
import { useNavigate } from "react-router-dom";
const requiredMessage = StandardConst.requiredMessage;
const numberError = StandardConst.numberError;
const mobileMessage = StandardConst.mobileMessage;
/* #endregion */


const CompanyRegistration = (prop, ref) => {
  const dispatch = useDispatch();

  const { useState } = React;
  const [show, setShow] = useState(false);
  const CompanyInfo = useSelector((s) => s.auth.CompanyInfo ?? {});
  const handleClose = () => setShow(false);
  const [data]=useState({File:null});
  const schema = yup
    .object()
    .shape({
      File: yup.mixed().required(requiredMessage),
      CompanyName: yup.string().trim().required(requiredMessage),
      Email: yup.string().email().required(requiredMessage),
      Password: yup.string().trim().required(requiredMessage).min(8).max(16),
      ConfirmPassword: yup
        .string()
        .test("passwords-match", "Passwords must match", function (value) {
          return this.parent.Password === value;
        }),
      Phone: yup
        .number()
        .typeError(numberError)
        .required(requiredMessage)
        .min(1000000000, mobileMessage),
    })
    .required();
  const resetDocumentForm = useRef();
  const successAlert = (res) => {
    SweetAlert.fire({
      text: res,
    });
  }

var nevigate=useNavigate();
  const onSubmit = async (data) => {
    data.Logo = await WebService({
      endPoint: "upload/File",
      body: data.File,
      dispatch,
      isFile: true,
    }).then((res) => res.filename);
    const responsedata = await WebService({
      endPoint: "registration/Company",
      body: omit(data,["File"]),
      dispatch,
    });
    nevigate(`/Auth?company=${responsedata}`);
  };

  return (
    
    <div className="container-fluid p-md-1 justify-content-center">
      <div class="ibox-content m-b-sm border-bottom">
        <div class="col-md-9">
          <div class="logo-icon-company-registration">
            <img
              src={`${StandardConst.apiBaseUrl}/uploads/${(CompanyInfo ?? {}).Logo ?? ""
                }`}
              alt="logo"
            />
          </div>
          <h2>{(CompanyInfo ?? {}).CompanyName ?? ""} </h2>
          <div class="forum-sub-title">
            Manage your staff attendance, salary, payments and compliances in
            few clicks
          </div>
        </div>
      </div>
      <div className="card1 card0 border-0">

     
        <div className="row d-flex justify-content-center p-md-4 hero">
      
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <h1>WISE HRMS is technology designed to streamline core HR services</h1>

              <p>Manage your staff attendance, salary, payments and compliances in few clicks</p>
              {/* <a className="cta" >Sign Up</a> */}
              <button className="cta" onClick={() => setShow(!show)}>
        {show ? "Fill Details" : "Sign Up"}
      </button>
              <p>Available on  : <i class="fa fa-android" aria-hidden="true"></i> <i class="fa fa-apple" aria-hidden="true"></i></p>
            </div>
            <div className="col-md-5 col-sm-12 offset-md-1">
              <img src="https://pagarbook.com/assets/in-image/home-banner.jpg" alt="" className="img-responsive" />
            </div>
          </div>
         
          {/* <div className="row pt-5">
            <div className="col-md-6 col-sm-12">
              <h1>Manage Staff Easily from your Desktop</h1>
              <p>  
              Enter your mobile number to continue
                 <FormInputText
              name="Phoneotp"             
              type="text"
              isRequired="true"
              placeholder="Enter Valid Mobile Number"
            />
           
              </p>

              <a className="cta" href="">Continue</a>


            </div>
            <div className="col-md-6  col-sm-12"> <img src="https://web.pagarbook.com/assets/onboarding/images/main.jpg" alt="" className="img-responsive" />
            </div>
          </div> */}
           {show && <div>
          <Form
            onSubmit={onSubmit}
            defaultValues={data}
          validationSchema={schema}
          >
            <div className="row pt-5">
              <div className="col-md-6 col-sm-11">
                <h1 className="pb-4">Fill Company Details</h1>

                <FormInputFile name="File" type="file" label="Choose Company Logo" isRequired="true" />

                <FormInputText
                  label="Enter Company Name"
                  name="CompanyName"
                  type="text" isRequired="true"
                  placeholder="Company Name"
                />

                <FormInputText name="Email" label="Enter Valid Email" type="text" isRequired="true" placeholder="Email Id" />
                <FormInputText
                  label="Enter Mobile Number"
                  name="Phone"
                  type="text"
                  minLength={10}
                  maxLength={10}
                  isRequired="true"
                  placeholder="Enter Valid Mobile Number"
                />
                <FormInputText
                  label="Enter Password"
                  name="Password"
                  type="password"
                  isRequired="true"
                  placeholder="Password"
                 
                />
                  <FormInputText
                      label="Confirm Password"
                      name="ConfirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                    />
                <div className="pt-4">

                  <Button
                    className="cta"
                    id="btnCompanySubmit"
                    type="submit">Submit
                  </Button>
                </div>

              </div>
              <div className="col-md-5 col-sm-12 offset-md-1 pt-5">
                <img src="https://pagarbook.com/assets/in-image/home-banner.jpg" alt="" />
              </div>
            </div>
          </Form>
          </div>}
        </div>
        
        <div className="d-md-none"></div>
        <FooterComponent />
      </div>
    </div>
  );
};

export default CompanyRegistration;
