/* #region Import */
import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../Component/LogIn/LogIn.css";
import * as yup from "yup";
import { format } from "date-fns";
import FooterComponent from "./Layout/FooterComponent";
import { WebService } from "../Services/WebService";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SnackbarComponent from "../Services/SnackbarComponent";
import DeleteConfirmAlert from "../Services/AlertComponent";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItem,
  List,
  MobileStepper,
  ListItemText,
  Alert,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { Form, FormInputDropdown, FormInputFile, FormInputText } from "./Form";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useTheme } from "@mui/material/styles";
import Button from "react-bootstrap/Button";
import { styled } from "@mui/material/styles";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import FileIcon from "@mui/icons-material/FilePresentOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import _, { extend, filter, omit, where } from "underscore";
import { dataClone } from "../Services/UtilityService";
import { StandardConst } from "../Services/StandardConst";
const requiredMessage = StandardConst.requiredMessage;
const numberError = StandardConst.numberError;
const mobileMessage = StandardConst.mobileMessage;
/* #endregion */

const steps = [
  {
    label: "Start Here",
  },
  {
    label: "Personal Details",
  },
  {
    label: "Address & Credentials",
  },
  {
    label: "Documents",
  },
];

export default function Register() {
  const ref = useRef();
  const refSnackbar = useRef();
  const CompanyInfo = useSelector((s) => s.auth.CompanyInfo ?? {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [registerData, setRegisterData] = useState({});
  const [registerDocumentData, setRegisterDocumentData] = useState({
    File: null,
  });
  const [employeeDocuments, setEmployeeDocuments] = useState([]);
  const [EmployeeId, setEmployeeId] = useState(0);
  const [showFinalSubmit, setShowFinalSubmit] = useState(0);
  const [passwordValues, setPasswordValues] = useState({ password: "", showPassword: false,});
  const [confirmpasswordValues, setConfirmPasswordValues] = useState({ password: "", showPassword: false,});
  const QualificationsData = [
    { text: "MCA", value: "MCA" },
    { text: "MA", value: "MA" },
    { text: "M COM", value: "M COM" },
  ];
  const WorkLocationData = [
    { text: "Work From Home", value: "Work From Home" },
    { text: "Work From Office", value: "Work From Office" },
  ];
  const [nametxt, setFullName] = useState('');
  const [fatherNametxt, setFatherName] = useState('');
  const [motherNmetxt, setMotherName] = useState('');
 
  const re = /^[A-Z a-z]+$/;
  const onNameInputChange = e => {
    const { value } = e.target;
    
    if (value === "" || re.test(value)) {
      setFullName(value);
    }
  }
  const onMnameInputChange = e => {
    const { value } = e.target;
    if (value === "" || re.test(value)) {
      setMotherName(value);
    }
  }
  const onFnameInputChange = e => {
    const { value } = e.target;
    
    if (value === "" || re.test(value)) {
      setFatherName(value);
    }
  }
  const schemaStep1 = yup
    .object()
    .shape({
      Email: yup.string().email().required(requiredMessage),
    })
    .required();
  const resetDocumentForm = useRef();
  const schema = yup
    .object()
    .shape({
      FullName:yup.string()
      .required(requiredMessage)
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
      MotherName:yup.string()
      .required(requiredMessage)
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
      FatherName:yup.string()
      .required(requiredMessage)
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
     // FullName: yup.string().trim().required(requiredMessage),
      //MotherName: yup.string().trim().required(requiredMessage),
     // FatherName: yup.string().trim().required(requiredMessage),
      DOB: yup.date().typeError(requiredMessage).required(requiredMessage),
      Phone: yup
        .number()
        .typeError(numberError)
        .required(requiredMessage)
        .min(1000000000, mobileMessage),
      EmergencyPhone: yup
        .number()
        .typeError(numberError)
        .required(requiredMessage)
        .min(1000000000, mobileMessage),
    })
    .required();

  const schemaAddress = yup
    .object()
    .shape({
      Qualifications: yup.string().trim().required(requiredMessage),
      Password: yup.string().trim().required(requiredMessage).min(8).max(16),
      ConfirmPassword: yup
        .string()
        .test("passwords-match", "Passwords must match", function (value) {
          return this.parent.Password === value;
        }),
      PermanentAddress: yup.string().trim().required(requiredMessage),
      CommunicationAddress: yup.string().trim().required(requiredMessage),
      Qualifications: yup.string().trim().required(requiredMessage),
      WorkLocation: yup.string().trim().required(requiredMessage),
    })
    .required();
   
    const handleClickShowPassword = () => {
      setPasswordValues({ ...passwordValues, showPassword: !passwordValues.showPassword });
    };
    
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
    
    const handlePasswordChange = (prop) => (event) => {
      setPasswordValues({ ...passwordValues, [prop]: event.target.value });
    };
  
    const handleClickShowConfirmPassword = () => {
      setConfirmPasswordValues({ ...confirmpasswordValues, showPassword: !confirmpasswordValues.showPassword });
    };
    
    const handleMouseDownConfirmPassword = (event) => {
      event.preventDefault();
    };
    
    const handleConfirmPasswordChange = (prop) => (event) => {
      setConfirmPasswordValues({ ...confirmpasswordValues, [prop]: event.target.value });
    };
  
    const handleSweetAlert = (Message, Title) => {
    Swal.fire({
      title: Title.charAt(0).toUpperCase() + Title.slice(1),
      html: Message,
      icon: Title,
      confirmButtonText: "OK",
    }).then(() => {
      if (Title == "success") {
        navigate("/Auth");
      }
    });
  };
  const schemaDocumentUpload = yup
    .object()
    .shape({
      DocumentTypeId: yup.string().trim().required(requiredMessage),
      Number: yup.string().trim().required(requiredMessage),
      File: yup.mixed().required(),
    })
    .required();

  const getDocuments = async () => {
    const data = await WebService({
      endPoint: `DocumentType/DocumentDetails/${EmployeeId}`,
      dispatch,
    });
    console.log("DOcument",data);
    setEmployeeDocuments(data);
    if (data?.length > 0) {
      setShowFinalSubmit("d-flex float-end");
    } else {
      setShowFinalSubmit("d-flex float-end d-none");
    }
  };
  const renderAfterCalled = useRef(false);
  useEffect(() => {
    if (!renderAfterCalled.current) {
      getDocuments();
    }
    renderAfterCalled.current = true;
  }, []);
  useEffect(() => {
    if(((CompanyInfo??{}).CompanyId??0)!=0)
      getDocumentType();
  }, [CompanyInfo]);

  const onSubmitDocument = async (data) => {
    data.FilePath = await WebService({
      endPoint: "upload/File",
      dispatch,
      body: data.File,
      isFile: true,
    }).then((res) => res.filename);
    await WebService({
      dispatch,
      endPoint: "User/Document",
      body: extend(omit(data, ["File"]), { EmployeeId }),
    });
    await getDocuments();
    resetDocumentForm.current.fnReset({ File: null });
  };
  const onFinalSubmitDocument = async (data) => {
    try {
      const response = await WebService({
        endPoint: `registration/submitEmployee/1/${EmployeeId}`,
        body: data,
        dispatch,
      });
      if (response.Status == "Success") {
        const info = await WebService({
          endPoint: `registration/fetchEmp`,
          dispatch,
        });
        info[0].TimeStamp = info[0].TimeStamp = format(
          new Date(info[0].TimeStamp),
          "yyyy-MM-dd"
        );
        var Notification = {};
        Notification.Title = "Registration - New Employee";
        Notification.Subject =
          "New Employee " +
          info[0].FullName +
          " Registered On " +
          info[0].TimeStamp +
          " Waiting for approval ";
        Notification.Route = "RegistrationApproval";        
        Notification.Status = 5;      
        Notification.EmployeeId = EmployeeId;
        Notification.RoleId = 7;
        console.log(Notification);
        const notification = await WebService({
          endPoint: `Notification/Create`,
          body: Notification,
          dispatch,
        });
        handleSweetAlert(response.Message, "success");
      } else {
        handleSweetAlert(response.Message, "error");
      }
    } catch (error) {
      console.log(error);
    }
  };
      // onClick={async () => {
                              //   await WebService({
                              //     dispatch,
                              //     endPoint: `User/Document/${data.DocumentId}`,
                              //     method: "DELETE",
                              //   });
                              //   await getDocuments();
                              // }}                       
  const onDelete = async (DocumentId) => {
    await WebService({
      dispatch,
      endPoint: `User/Document/${DocumentId}`,
      method: "DELETE",
    });
    refSnackbar.current.setOpenSnackBar();
    await getDocuments();
  };
  const onSubmit = async (data) => {
    console.log("data",data);
    if ((data?.DOB || "") !== "")
    data.DOB = format(new Date(data.DOB), "yyyy-MM-dd");
    setRegisterData(data);
    handleNext();
  };

  const onSubmitAddress = async (data) => {
    setRegisterData(data);

    await WebService({
      endPoint: `registration/create/${EmployeeId}/${(CompanyInfo??{}).CompanyId}`,
      body: data,
      dispatch,
    }).then((data) => {
      setEmployeeId(data.data.EmployeeId);
      getDocuments();
      handleNext();
    });
  };

  const [response, setResponse] = React.useState({});
  const onSubmitStep1 = async (data) => {
    const result = await WebService({
      endPoint: `Registration/checkEmployee/0`,
      body: data,
      dispatch,
    });
    if (result.Step == 1 && result.Message == "Register User") {
      setResponse(result);
      setRegisterData(result.data);
      setOpen(true);
    } else if (result.Step == 0 && result.Message == "Email Already Exits") {
      setResponse(result);
      getDocuments();
      setEmployeeId(result.data.EmployeeId);
      if ((result?.data?.DOB || "") !== "")
        result.data.DOB = format(new Date(result.data.DOB), "yyyy-MM-dd");
      setRegisterData(result.data);
      setOpen(true);
    } else {
      setEmployeeId("0");
      setRegisterData(data);
      setActiveStep(1);
    }
  };
  //Dialog Box Start
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    if (response.Message == "Register User") {
      //Redirect to Login Here
    } else {
      setActiveStep(response?.data?.Step + 1 ?? 0);
      setOpen(false);
    }
  };

  //Dialog Box End

  const [documentData, setDocumentData] = useState([]);
  const getDocumentType = () => {
    WebService({
      endPoint: `DocumentType/Fetch?CompanyId=${(CompanyInfo??{}).CompanyId}`,
      dispatch,
    }).then((data) => {
      setDocumentData(
        data.map((v) => {
          return {
            value: v.DocumentTypeId,
            text: v.DocumentType,
          };
        })
      );
    });
  };
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  const Demo = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
  }));

  const Grid = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  const theme = useTheme();

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    console.log(activeStep, "sdfsdf", EmployeeId);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const fnRemaningDocType = () => {
    return filter(
      dataClone(documentData ?? []),
      (f) =>
        where(dataClone(employeeDocuments ?? []), { DocumentTypeId: f.value })
          .length < 1
    );
  };
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div>
            <div className="row p-md-4">
              <Form
                defaultValues={registerData}
                onSubmit={onSubmitStep1}
                validationSchema={schemaStep1}
              >
                <div className="row">
                  <Dialog
                    open={open}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                  >
                    <DialogTitle>
                      Welcome: {response?.data?.FullName ?? ""}
                    </DialogTitle>

                    <DialogContent dividers>
                      <DialogContentText id="alert-dialog-slide-description">
                        <span>
                          We found that you are already register with us with
                          the following details, click <strong>Continue</strong>{" "}
                          to complete your registration
                        </span>
                        <div className="mt-2">
                          Name: {response?.data?.FullName ?? ""}
                        </div>
                        <div>Email: {response?.data?.Email ?? ""}</div>
                        <div> Status: {response?.data?.StatusId ?? ""}</div>
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => {
                          setResponse({});
                          setRegisterData({});
                          setEmployeeId(0);
                          setEmployeeDocuments([]);
                          setShowFinalSubmit("");
                          setOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleClose}>Continue</Button>
                    </DialogActions>
                  </Dialog>

                  <div className="col-md-8">
                    <FormInputText
                      label="Email ID (Your login)"
                      name="Email"
                      type="text"
                      disabled={response?.data?.Email == null ? false : true}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-8">
                    <div className="d-flex float-end">
                      <Button
                        variant="outline-primary"
                        type="submit"
                        id="btnRegisterEmail"
                      >
                        {step === steps.length - 1 ? "Finish" : "Continue"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="row p-md-4">
            <Form
              defaultValues={registerData}
              onSubmit={onSubmit}
              validationSchema={schema}
            >
              <div className="row">
                <div className="col-md-6">
                  <FormInputText
                    label="Full Name"
                    name="FullName"
                    maxLength={40}
                    type="text"                    
                   // value={nametxt}
                    //onChange={onNameInputChange}
                  />
                </div>

                <div className="col-md-6">
                  <FormInputText 
                  label="Date of birth"
                   name="DOB" 
                  // max="2999-12-31"                    
                   max={new Date().toISOString().split("T")[0]}
                   type="date" />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <FormInputText
                    label="Mother's Name"
                    name="MotherName"
                    maxLength={40}
                    type="text"
                   // value={motherNmetxt}
                    //onChange={onMnameInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <FormInputText
                    label="Mobile"
                    minLength={10}
                    maxLength={10}
                    name="Phone"
                    type="text"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <FormInputText
                    label="Father's Name"
                    name="FatherName"
                    type="text"
                    maxLength={40}
                   // value={fatherNametxt}
                    //onChange={onFnameInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <FormInputText
                    label="Emergency Mobile"
                    name="EmergencyPhone"
                    type="text"
                    minLength={10}
                    maxLength={10}
                  />
                </div>
              </div>
              <div className="d-flex float-end">
                <Button
                  className="me-2"
                  variant="outline-success"
                  id="btnPersonalDetailsBack"
                  disabled={step === 0}
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Back
                </Button>
                <Button
                  variant="outline-primary"
                  id="btnRegisterPersonalDetails"
                  type="submit"
                >
                  {step === steps.length - 1 ? "Finish" : "Continue"}
                </Button>
              </div>
            </Form>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="row p-md-4">
              <Form
                defaultValues={registerData}
                onSubmit={onSubmitAddress}
                validationSchema={schemaAddress}
              >
                <div className="row">
                  <div className="col-md-6">
                    <FormInputText
                      label="Permanent Address"
                      name="PermanentAddress"
                      as="textarea"
                    />
                  </div>

                  <div className="col-md-6">
                    <FormInputText
                      label="Communication Address"
                      name="CommunicationAddress"
                      as="textarea"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <FormInputText
                      label="Password"
                      name="Password"
                     // type="password"
                      type={passwordValues.showPassword ? "text" : "password"}
                      //onChange={handlePasswordChange("password")}
                      //value={passwordValues.password}                                                                  
                    />
                     <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {passwordValues.showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
                    
                  </div>
                  <div className="col-md-6">
                    <FormInputText
                      label="Confirm Password"
                      name="ConfirmPassword"
                     // type="password"
                      type={confirmpasswordValues.showPassword ? "text" : "password"}
                      //onChange={handleConfirmPasswordChange("password")}
                     // value={confirmpasswordValues.password}    
                    /> 
                    <IconButton
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownConfirmPassword}
                    position="end"
                  >
                    {confirmpasswordValues.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <FormInputDropdown
                      name="Qualifications"
                      ddOpt={QualificationsData}
                      label="Select Qualifications"
                    ></FormInputDropdown>
                  </div>
                  <div className="col-md-6">
                    <FormInputDropdown
                      name="WorkLocation"
                      ddOpt={WorkLocationData}
                      label="Select Location"
                    ></FormInputDropdown>
                  </div>
                </div>
                <div className="d-flex float-end">
                  <Button
                    className="me-2"
                    variant="outline-success"
                    id="btnAddressBack"
                    disabled={step === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="outline-primary"
                    id="btnRegisterAddress"
                    type="submit"
                  >
                    {step === steps.length - 1 ? "Finish" : "Continue"}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <Form
              defaultValues={registerDocumentData}
              onSubmit={onSubmitDocument}
              validationSchema={schemaDocumentUpload}
              ref={resetDocumentForm}
            >
              <div>
                {fnRemaningDocType().length > 0 && (
                  <>
                    <Grid item xs={12} md={12} sx={{ mt: 0, mb: 2 }}>
                      <div className="row">
                        <div className="col-md-6">
                          <FormInputDropdown
                            name="DocumentTypeId"
                            ddOpt={[{ value: null, text: "" }].concat(
                              fnRemaningDocType()
                            )}
                            label="Select Document"
                          ></FormInputDropdown>
                        </div>
                        <div className="col-md-6">
                          <FormInputFile name="File" type="file" />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <FormInputText
                            label="Document Number"
                            name="Number"
                            type="text"
                          />
                        </div>
                        <div className="col-md-6 text-end">
                          <Button id="button-addon2" type="submit">
                            Upload
                          </Button>
                        </div>
                      </div>
                    </Grid>
                  </>
                )}

                <Grid item xs={12} md={12} sx={{ mt: 0, mb: 2 }}>
                  <Alert severity="info">
                    <strong>Documents </strong> — Final Step
                  </Alert>
                  <Demo>
                    <List dense={dense}>
                      {employeeDocuments?.map((data) => {
                        const deleteAction = (
                          <>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={(e) =>
                                ref.current.confirmAlert(
                                  "Delete", //Confirm button text
                                  "Are You Sure", // Text if Alert
                                  "Do you want to delete this document ", // Message of Alert
                                  data.DocumentId // Endpoint to hit for delete
                                )
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        );
                        return (                          
                          <ListItem
                            secondaryAction={deleteAction}
                            primaryAction={deleteAction}
                          >
                            <ListItemAvatar>
                              <Avatar>
                                <FileIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={data.DocumentType} />
                            <ListItemText className="text-align:left" primary={data.Number} />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Demo>
                </Grid>
                <SnackbarComponent ref={refSnackbar} confirmMessage="Document Deleted successfully" />
                <DeleteConfirmAlert ref={ref} confirmEvent={(v) => onDelete(v)} />
              </div>
            </Form>
            <div className="row">
              <div className="col-md-10 d-flex float-start">
                <Alert severity="success" className={showFinalSubmit}>
                  Click on
                  <strong className="mx-1">Submit Button</strong>
                  to complete your registration @ Wise Software
                </Alert>
              </div>

              <div className="col-md-2 d-flex float-end p-1">
                <Button
                  className="me-2"
                  variant="outline-success"
                  id="btnDocumentsBack"
                  disabled={step === 0}
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Back
                </Button>
                <div className={showFinalSubmit}>
                  <Button
                    variant="outline-primary"
                    id="btnRegisterFinal"
                    type="button"
                    onClick={() => onFinalSubmitDocument(registerData)}
                  >
                    {step === steps.length - 1 ? "Submit" : "Continue"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return "Unknown step";
    }
  };

  return (
    <div
      className="container-fluid p-md-1 justify-content-center"
      style={{ maxWidth: "1000px" }}
    >
      <div class="ibox-content m-b-sm border-bottom">
        <div class="col-md-9">
          <div class="logo-icon">
            <img src={`${StandardConst.apiBaseUrl}/uploads/${(CompanyInfo??{}).Logo??""}`} alt="logo" className="img-size" />
          </div>
          <h2>Employee Registration</h2>
          <div class="forum-sub-title">Description</div>
        </div>
      </div>
      <div className=" card card0 border-0">
        <div className="row d-flex justify-content-center p-md-4">
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  <div>{getStepContent(index)}</div>

                  <Box sx={{ mb: 2 }}></Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>
                All steps completed - you&apos;re finished
              </Typography>
              <Button
                id="btnRegisterReset"
                onClick={handleReset}
                sx={{ mt: 1, mr: 1 }}
              >
                Reset
              </Button>
            </Paper>
          )}
        </div>
        <div className="d-md-none">
          <MobileStepper
            variant="progress"
            steps={6}
            position="static"
            activeStep={activeStep}
            sx={{ maxWidth: 400, flexGrow: 1 }}
            nextButton={
              <Button
                size="small"
                id="btnRegisterNext"
                onClick={handleNext}
                disabled={activeStep === 5}
              >
                Next
                {theme.direction === "rtl" ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button
                size="small"
                id="btnRegisterBackStep"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Back
              </Button>
            }
          />
        </div>
        <FooterComponent />
      </div>
    </div>
  );
}
