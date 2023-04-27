import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { WebService } from "../../Services/WebService";
import "./LogIn.css";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const fetchMail = async () => {
    const data = await WebService({ endPoint: "LogIn/Fetch1" });
    setRecords(data);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { Email, OldPassword, NewPassword, ConfirmPassword } =
      e.target.elements;

    let details = {
      Email: Email.value,
      OldPassword: OldPassword.value,
      NewPassword: NewPassword.value,
      ConfirmPassword: ConfirmPassword.value,
    };

    WebService({
      endPoint: "LogIn/Update",
      method: "POST",
      body: details,
    }).then((res) => {
      if (res.redirection > 0) {
        navigate("/LogIn", { replace: true });
      } else {
        console.log("Wrong Password");
      }
    });
  };
  return (
    <>
      <div className="container">
        <div className="row mt-4 mb-4 justify-content-center">
          <div className="col-md-4 success bg-light mt-5 ml-5 p-4">
            <form onSubmit={handleSubmit}>
              <h2 className="text-center head-t">Change Password</h2>
              <div className="col-md-10 m-4 mb-3 mt-4">
                <div className="border no-border">
                  <input
                    className="col-lg-12 app border no-border pb-3 pt-3"
                    id="email"
                    placeholder="email"
                    name="Email"
                    // value={data.Email}
                  />
                </div>
              </div>
              <div className="col-md-10 m-4 mb-3 mt-4">
                <div>
                  <input
                    className="col-lg-12 border app no-border pb-3 pt-3"
                    type="password"
                    id="oldPassword"
                    placeholder="oldPassword"
                    name="OldPassword"
                  />
                </div>
              </div>
              <div className="col-md-10 m-4 mb-3 mt-4">
                <div>
                  <input
                    className="col-lg-12 border app no-border pb-3 pt-3"
                    type="password"
                    id="newPassword"
                    placeholder="newPassword"
                    name="NewPassword"
                  />
                </div>
              </div>
              <div className="col-md-10 m-4 mb-3 mt-4">
                <div>
                  <input
                    className="col-lg-12 border app no-border pb-3 pt-3"
                    type="password"
                    id="confirmPassword"
                    placeholder="confirmPassword"
                    name="ConfirmPassword"
                  />
                </div>
              </div>
              <div className="col-lg-10 mt-4 mx-4 d-grid border no-border">
                <button
                  id="SubmitBtn"
                  className=" bapp p-3 rounded-0 text-center"
                >
                  Login
                </button>
              </div>
              <h1
                style={{
                  fontSize: "15px",
                  textAlign: "center",
                  marginTop: "20px",
                  color: "",
                }}
              ></h1>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
