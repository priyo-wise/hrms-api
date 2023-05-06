import { useState } from "react";
import Box from '@mui/material/Box';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { WebService } from "../../Services/WebService";
import SweetAlert from "sweetalert2";
import * as yup from "yup";
import { Form, FormInputText } from "../Form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {IconButton, }from "@mui/material";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';

const ChangePassword = () => {  
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const dispatch = useDispatch();
  const fetchMail = async () => {
    const data = await WebService({ dispatch, endPoint: "LogIn/Fetch1" });
    setRecords(data);
  };
  const [passwordValues, setPasswordValues] = useState({ password: "", showPassword: false,});
  const [newPasswordValues, setNewPasswordValues] = useState({ password: "", showPassword: false,});
  const [confirmpasswordValues, setConfirmPasswordValues] = useState({ password: "", showPassword: false,});



  const handleClickShowPassword = () => setShowPassword((show) => !show);


  const [passwordType, setPasswordType] = useState("password");
    const [passwordInput, setPasswordInput] = useState("");
    const handlePasswordChange =(evnt)=>{
        setPasswordInput(evnt.target.value);
    }
    const togglePassword =()=>{
      if(passwordType==="password")
      {
       setPasswordType("text")
       return;
      }
      setPasswordType("password")
    }

  // const handleClickShowPassword = () => {
  //   setPasswordValues({ ...passwordValues, showPassword: !passwordValues.showPassword });
  // };
  
  const handleClickNewPassword = () => {
    setNewPasswordValues({ ...newPasswordValues, showPassword: !newPasswordValues.showPassword });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  
  // const handlePasswordChange = (prop) => (event) => {
  //   setPasswordValues({ ...passwordValues, [prop]: event.target.value });
  // };

  const handleClickConfirmPassword = () => {
    setConfirmPasswordValues({ ...confirmpasswordValues, showPassword: !confirmpasswordValues.showPassword });
  };
  
  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };
  
  const handleConfirmPasswordChange = (prop) => (event) => {
    setConfirmPasswordValues({ ...confirmpasswordValues, [prop]: event.target.value });
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
    console.log("changepwd",data);
    WebService({
      dispatch,
      endPoint: "LogIn/Update",
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
      <div className="row">
           
      </div>
      <div className="row mt-4 mb-4 justify-content-center">
{/*         
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        </Box> */}
        <div className="col-md-8 success bg-info mt-5 ml-5 p-4">
          <Form onSubmit={onSubmit} validationSchema={formSchema}>
            <h2 className="text-center head-t">Change Password</h2>
            
            <div className="row m-4 mb-3 mt-4">
            <div className="col-md-8">
                <FormInputText                
                  label="Old-Password"
                  //type={passwordValues.showPassword ? "text" : "password"}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Old-Password"
                  name="OldPassword"
                  // endAdornment={
                  //     <IconButton
                  //       aria-label="toggle password visibility"
                  //       onClick={handleClickShowPassword}
                  //       onMouseDown={handleMouseDownPassword}
                  //       edge="end"
                  //     >
                  //       {showPassword ? <VisibilityOff /> : <Visibility />}
                  //     </IconButton>
                  // }
                />
                </div>
                 <div className="col-md-2">
                <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {passwordValues.showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>               
            </div>
            </div>
            <div className="row m-4 mb-3 mt-4">
            <div className="col-md-8">
                <FormInputText
                  label="New-Password"
                  type={newPasswordValues.showPassword ? "text" : "password"}
                  placeholder="New-Password"
                  name="NewPassword"
                />
                </div>
                <div className="col-md-2">
                <IconButton
            onClick={handleClickNewPassword}
            onMouseDown={handleMouseDownPassword}
          >
            {newPasswordValues.showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton> 
              </div>
            </div>
            <div className="row m-4 mb-3 mt-4">
            <div className="col-md-8">
                <FormInputText
                  label="Confirm-Password"
                  type={confirmpasswordValues.showPassword ? "text" : "password"}
                  placeholder="Confirm-Password"
                  name="ConfirmPassword"
                />
                </div>
                <div className="col-md-2">
                <IconButton
            onClick={handleClickConfirmPassword}
            onMouseDown={handleMouseDownPassword}
          >
            {confirmpasswordValues.showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton> 
              </div>
            </div>
            <div className="col-12 text-center">
              <button
                id="btnUpdatePassword"
                type="submit"
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
