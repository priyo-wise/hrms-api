import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { WebService } from "../../Services/WebService";
import "./LogIn.css";
import { useNavigate } from "react-router-dom";
import validator from "validator";

const LogIn = () => {
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
  const SubmitData = async (e) => {
    const { Email, Password } = e.target.elements;
    let data = {
      Email: Email.value,
      Password: Password.value,
    };

    WebService({ endPoint: "LogIn/Fetch", method: "POST", body: data }).then(
      (res) => {
        if (
          res.data[0].Email === data.Email &&
          res.data[0].Password === data.Password
        ) {
          navigate("/Dashboard", { replace: true });
        } else {
          setLoginStatus("Email or Password Incorrect");
        }
      }
    );
    e.preventDefault();
  };
  return (
    <>
      <div className="container">
        <div className="row mt-4 mb-4 justify-content-center">
          <div className="col-md-4 success bg-light mt-5 ml-5 p-4">
            <form
              className=" row d-flex justify-content-center align-content-center"
              onSubmit={SubmitData}
            >
              <h2 className="text-center head-t">LogIn</h2>
              <div className="col-md-10 m-4 mb-3 text-center mt-4">
                <div className="border no-border">
                  <input
                    className="col-lg-12 app border no-border pb-3 pt-3"
                    id="email"
                    placeholder="email"
                    name="Email"
                    onChange={(e) => validateEmail(e)}
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
              <div className="col-md-10 m-4 mb-3 mt-4">
                <div>
                  <input
                    className="col-lg-12 border app no-border pb-3 pt-3"
                    type="password"
                    id="password"
                    placeholder="password"
                    name="Password"
                  />
                </div>
              </div>
              <div className="row d-flex justify-content-center mt-4 align-content-center ">
                {" "}
                <button
                  id="SubmitBtn"
                  className="bapp p-3 radius text-light rounded btn-md w-80 col-4"
                >
                  Login
                </button>{" "}
              </div>
              <div className="col-md-12">
                <p className="mt-3 mx-5">
                  Forgot your password?{" "}
                  <a href="/ForgetPassword">Forgot Password</a>
                </p>
              </div>
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
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogIn;
