/* #region Import */
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { WebService } from "../../Services/WebService";
import "./LogIn.css";
import { Link, useNavigate } from "react-router-dom";
import validator from "validator";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../Services/authSlice";
import FooterComponent from "../Layout/FooterComponent";
import SweetAlert from "sweetalert2";
import SendMail from "./SendMail";
import * as yup from "yup";
import { StandardConst } from "../../Services/StandardConst";

/* #endregion */
const LogIn = () => {
  const CompanyInfo = useSelector((s) => s.auth.CompanyInfo ?? {});
  const [modalShow, setModalShow] = useState(false);
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState("");
  const [emailError, setEmailError] = useState("");
  const validateEmail = (e) => {
    var Email = e.target.value;

    if (!validator.isEmail(Email)) {
      setEmailError("Enter Valid Email");
    } else {
      setEmailError();
    }
  };
  const successAlert = (res) => {
    SweetAlert.fire({
      text: res,
      icon: "info",
    });
  };
  const dispatch = useDispatch();
  const requiredMessage = "This is a required field";
  const schema = yup
    .object()
    .shape({
      Email: yup.string().trim().required(requiredMessage),
      Password: yup.string().trim().required(requiredMessage),
    })
    .required();
  const SubmitData = async (e) => {
    const { Email, Password } = e.target.elements;
    let data = {
      Email: Email.value,
      Password: Password.value,
      CompanyId: (CompanyInfo??{}).CompanyId
    };
    WebService({
      endPoint: "LogIn/Validate",
      method: "POST",
      body: data,
      dispatch,
    }).then((res) => {
      navigate("/");
      dispatch(login());
    });

    e.preventDefault();
  };
  const onRegister = () => {
    navigate(`/Auth/Register?company=${(CompanyInfo ?? {}).Code}`);
  };

  return (
    <>
      <form onSubmit={SubmitData} validationSchema={schema}>
        <div class="container-fluid px-1 px-md-5 px-lg-1 px-xl-5 py-5 mx-auto">
          <div class="card card0 border-0">
            <div class="row d-flex">
              <div class="col-lg-6 d-none d-lg-block">
                <div class="card1 pb-5">
                  <div class="row">
                    <img
                      src={`${StandardConst.apiBaseUrl}/uploads/${
                        (CompanyInfo ?? {}).Logo ?? ""
                      }`}
                      class="logo"
                      alt="logo"
                    />
                  </div>
                  <div class="row px-3 justify-content-center mt-4 mb-5 border-line">
                    <img src="loginImage.png" class="image" alt="image" />
                  </div>
                </div>
              </div>

              <div class="col-lg-6 px-6 mt-3">
                <div class="card2 border-0 px-6 py-5">
                  <div class="row px-2 mb-4">
                    <h1
                      style={{
                        fontSize: "15px",
                        textAlign: "center",
                        marginTop: "20px",
                        color: "",
                      }}
                    >
                      {loginStatus}
                    </h1>
                    <div class="line d-none d-lg-block"></div>
                    <span class="or text-center d-none d-lg-block">
                      Sign in
                    </span>
                    <span class="text-center d-none d-sm-block d-lg-none">
                      <strong>Sign in</strong>
                    </span>
                    <div class="line d-none d-lg-block"></div>
                  </div>
                  <div class="row px-3 px-6 mb-3">
                    <div>
                      <label class="mb-1">
                        <h6 class="mb-0 text-sm">Email Address</h6>
                      </label>
                      <input
                        class="mb-0"
                        type="text"
                        id="btnEmail"
                        name="Email"
                        onChange={(e) => validateEmail(e)}
                        placeholder="Enter a valid email address"
                      />
                    </div>
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "red",
                      }}
                    >
                      {emailError}
                    </span>
                  </div>

                  <div class="row px-3 px-6 ">
                    <div>
                      <label class="mb-1">
                        <h6 class="mb-0 text-sm">Password</h6>
                      </label>
                      <input
                        type="password"
                        id="btnPassword"
                        placeholder="password"
                        name="Password"
                      />
                    </div>
                  </div>

                  <div class="row mb-3 px-3 mt-4 justify-content-end">
                    <button
                      type="submit"
                      id="btnLogin"
                      class="btn btn-primary text-center w-60 col-4"
                    >
                      Login
                    </button>
                  </div>
                  <div class=" d-flex justify-content-between mb-4 px-3 pt-3">
                    <div>
                      {" "}
                      <a
                        href="#"
                        class="mb-0 text-sm"
                        id="btnForgotPassword"
                        onClick={() => setModalShow(true)}
                      >
                        Forgot Password?
                      </a>
                    </div>

                    <SendMail
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                      //value={reset(Email)}
                    />
                    <div>
                      {" "}
                      <small class="font-weight-bold">
                        Don't have an account?{" "}
                        <a
                          class="text-danger"
                          id="btnRegister"
                          onClick={onRegister}
                        >
                          Register
                        </a>
                      </small>
                    </div>
                  </div>
                  {((CompanyInfo ?? {}).IsDefault ?? 0) == 1 && (
                    <>
                      <small class="px-3 font-weight-bold">
                        <Link
                          class="text-danger"
                          id="btnCompanyRegister"
                          to="/Auth/CompanyRegistration"
                        >
                          Company Registration
                        </Link>
                      </small>
                    </>
                  )}
                </div>
              </div>
            </div>
            <FooterComponent />
          </div>
        </div>
      </form>
    </>
  );
};

export default LogIn;
