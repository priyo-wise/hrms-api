import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { WebService } from "../../Services/WebService";
import SweetAlert from "sweetalert2";
import * as yup from "yup";
import { Form, FormInputText } from "../Form";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const dispatch = useDispatch();
  const fetchMail = async () => {
    const data = await WebService({ dispatch, endPoint: "LogIn/Fetch1" });
    setRecords(data);
  };
  const formSchema = yup.object().shape({
    OldPassword: yup.string().required("This is a required field"),
    NewPassword: yup
      .string()
      .required("This is a required field")
      .min(8, "Password must be at 8 char long"),
    ConfirmPassword: yup
      .string()
      .required("This is a required field")
      .oneOf([yup.ref("NewPassword")], "Password does not match"),
  });
  const successAlert = (res) => {
    SweetAlert.fire({
      text: res,
    });
  };
  const onSubmit = async (data) => {
    WebService({
      endPoint: "LogIn/Update",
      method: "POST",
      body: data,
    }).then((res) => {
      if (res == "Password Updated Successfully") {
        successAlert(res);
        navigate("/", { replace: true });
      } else {
        successAlert(res);
      }
    });
  };
  return (
    <div className="container app">
      <div className="row mt-4 mb-4 justify-content-center">
        <div className="col-md-4 success bg-info mt-5 ml-5 p-4">
          <Form onSubmit={onSubmit} validationSchema={formSchema}>
            <h2 className="text-center head-t">Change Password</h2>

            <div className="col-md-10 m-4 mb-3 mt-4">
              <div>
                <FormInputText
                  type="password"
                  placeholder="Old-Password"
                  name="OldPassword"
                />
              </div>
            </div>
            <div className="col-md-10 m-4 mb-3 mt-4">
              <div>
                <FormInputText
                  type="password"
                  placeholder="New-Password"
                  name="NewPassword"
                />
              </div>
            </div>
            <div className="col-md-10 m-4 mb-3 mt-4">
              <div>
                <FormInputText
                  type="password"
                  placeholder="Confirm-Password"
                  name="ConfirmPassword"
                />
              </div>
            </div>
            <div className="col-lg-10 mt-4 mx-4 d-grid border no-border">
              <button
                id="btnUpdatePassword"
                className=" btn btn-primary p-3 rounded-0 text-center"
              >
                Update Password
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
