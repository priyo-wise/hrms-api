/* #region Import */
import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./EditProfile.css";
import { WebService } from "../../Services/WebService";
import { StandardConst } from "../../Services/StandardConst";
import { useDispatch } from "react-redux";
import axios from "axios";
import Container from "react-bootstrap/Container";
import ViewDocument from "./ViewDocument";
import Swal from "sweetalert2";
import _, { each, findWhere, omit } from "underscore";
import format from "date-fns/format";
import {
  Alert,
  Avatar,
  Box,
  ButtonGroup,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import MButton from "@mui/material/Button";
import * as yup from "yup";
import { InputDropdown, FormInputText, Form, InputText } from "../Form";
import TableComponent from "../../Services/TableComponent";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import SnackbarComponent from "../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import StaticListComponent from "../../Services/StaticListComponent";
import ActionButton from "../../Services/ActionButton";
import AddEditFamilyDetails from "./AddEditFamilyDetails";
import { ActionPermission } from "../PageInfo";

/* #endregion */
const Profile = () => {
  const [text, setText] = useState("");

  const [permission] = useState({
    ManageReject: ActionPermission("EmployeeDocument - Reject"),
    ManageApprove: ActionPermission("EmployeeDocument - Approve"),
    ManageView: ActionPermission("EmployeeDocument - View"),
  });
  const { state } = useLocation();
  const EmpId = state?.EmpId ?? 0;
  const dispatch = useDispatch();
  const ref = useRef();
  const refSnackbar = useRef();
  const [records, setRecords] = useState([]);
  const [info, setInfo] = useState([]);
  const [information, setInformation] = useState([]);
  const [dp, setDp] = useState([]);
  const [doc, setDoc] = useState([]);
  const renderAfterCalled = useRef(false);
  const viewModalRef = useRef();
  const [show, setShow] = useState(false);
  const [userDOB, setUserDOB] = useState();
  const [empDOJ,setDOJ]=useState();
  const [ApproveData, setData] = useState({
    FromDate: null,
    ToDate: null,
  });
  const [officelocationData, setlocatiinData] = useState({});
  useEffect(() => {
    if (!renderAfterCalled.current) {
      //setEmployee(EmpId);

      fetchProfile();
      fetchFamily();
      GenerateToken();
      fetchEmployeeDocuments(EmpId);
      getManagerByRole();
      getsetlocation();
    }
    renderAfterCalled.current = true;
  }, []);

  const fetchProfile = async () => {
    const data = await WebService({
      endPoint: `UserProfile/Fetch/${EmpId || 0}`,
      dispatch,
    });
    if ((data[0]?.Anniversary || "") !== "")
      data[0].Anniversary = format(new Date(data[0].Anniversary), "yyyy-MM-dd");
    if ((data[0]?.DOB || "") !== "")
      data[0].DOB = format(new Date(data[0].DOB), "yyyy-MM-dd");
    if ((data[0]?.DOJ || "") !== "")
      data[0].DOJ = format(new Date(data[0].DOJ), "yyyy-MM-dd");

    setUserDOB(data[0]?.DOB);
    setDp(data[0]?.ProfileImage ?? null);
    setRecords(data);
    console.log("photo",dp);

  };
  const GenerateToken = async () => {
    const data = await WebService({
      endPoint: `User/Token`,
      method: "Get",
      dispatch,
    });
    console.log(data);
  };
  const fetchEmployeeDocuments = async () => {
    const data = await WebService({
      endPoint: `DocumentType/DocumentDetails/${EmpId || 0}`,
      dispatch,
    });
    setDoc(data);
  };

  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");

  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const fnView = async (id) => await viewModalRef.current.openModal(id || 0);

  const requiredMessage = "This is a required field";
  const schema = yup.object().shape({
   // DOJ: yup.string().trim().required(requiredMessage),
  }).required();

  const [approvedData, setApprovedData] = React.useState({});

  const [approvelocationData, setaAprovelocationData] = React.useState({});

  const onApprovalSubmit = (data) => {
    // AlertComponent.getAlert();
    // const result = await WebService({
    //   endPoint: `UserProfile/CreateEmployeeManager/${data.ManagerId}/${EmpId}`,
    //   body: data,
    //   dispatch,
    // });
  };
  const approveRejectEmployee = async (status) => {
    
    var statusTest = null;
    if (status == 3) {
      statusTest = "Approved";
    } else {
      statusTest = "Rejected";
    }
    if(records[0].DOJ==null && statusTest == "Approved"){
      Swal.fire({
        title: "Pending",
        text: "Please Enter Employee's Date Of joining",
        icon: "error",
      });
    }else{
      const result = await WebService({
        endPoint: `UserProfile/CreateEmployeeManager/${status}/${EmpId}/${status}`,
        body: {},
        dispatch,
      });
  
      if (result.message == "Document Approval is pending") {
        Swal.fire({
          title: "Pending",
          text: result.message,
          icon: "error",
        });
      } else {
        Swal.fire({
          title: statusTest,
          text: result.message,
          icon: "info",
        });
  
    }
    
      Navigate("/RegistrationApproval", { state: { EmpId: null } });
    }
  };

  const assignOfficelocation = async () => {
    let data = {
      OfficeLocationId: officelocationData.OfficeLocationId,
      EmployeeId: EmpId,
    };

    const result = await WebService({
      endPoint: `UserProfile/CreateEmployeeOfficelocation`,
      body: data,
      dispatch,
    });

    Swal.fire({
      title: "Assigned",
      text: result.message,
      icon: "info",
      showCancelButton: true,
    });

    Navigate("/RegistrationApproval", { state: { EmpId: null } });
  };

  const [ManagerData, setManagerData] = useState([]);
  const getManagerByRole = () => {
    WebService({
      endPoint: `UserProfile/FetchManager`,
      dispatch,
    }).then((data) => {
      setManagerData(
        data.data.map((v) => {
          return {
            value: v.EmpId,
            text: v.FullName,
          };
        })
      );
    });
  };
  const [locationData, setlocationData] = useState([]);
  const getsetlocation = () => {
    WebService({
      endPoint: `UserProfile/Fetchlocation`,
      dispatch,
    }).then((data) => {
      setlocationData(
        data.data.map((v) => {
          return {
            value: v.OfficeLocationId,
            text: v.Location,
          };
        })
      );
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      FullName,
      Email,
      Phone,
      EmergencyPhone,
      PermanentAddress,
      CommunicationAddress,
      Qualifications,
      DOB,
      DOJ,
      Anniversary,
    } = e.target.elements;
    let details = {
      FullName: FullName.value,
      Email: Email.value,
      Phone: Phone.value,
      EmergencyPhone: EmergencyPhone.value,
      PermanentAddress: PermanentAddress.value,
      CommunicationAddress: CommunicationAddress.value,
      Qualifications: Qualifications.value,
      DOB: DOB.value,
      DOJ: DOJ.value,
      Anniversary: Anniversary?.value ?? null,
    };
    details.EmployeeId = records[0]?.EmployeeId;
    console.log("details",details);
    WebService({
      dispatch,
      endPoint: "UserProfile/Update",
      method: "POST",
      body: details,
    }).then((res) => {
      Swal.fire({
        title: "Profile",
        text: "Profile Updated",
        icon: "info",
      });
      fetchProfile();
      GenerateToken();
    });
  };
  const [open, setOpen] = React.useState(false);
  const [viewDoc, setViewDoc] = React.useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onView = (DocumentId, e) => {
    setViewDoc(
      doc.find((Documentid) => Documentid.DocumentId == DocumentId).FilePath
    );
    handleOpen();
  };

  const createNotification = async () => {
    var Notification = {};
    Notification.Title = "Document Approve Reject";
    Notification.Subject =
      "Your Document " +
      information[0].DocumentType +
      " Has been " +
      information[0].Status;
    Notification.Route = "RegistrationApproval";
    Notification.RoleId = 7;
    Notification.EmployeeId = information[0].EmployeeId;
    await WebService({
      endPoint: `Notification/Create`,
      body: Notification,
      dispatch,
    });
  };

  const onApproveReject = async (DocumentId, e) => {
    var confirmMessage = "You want to ";
    var Status = 0;
    if (e.currentTarget.id == "btnReject") {
      confirmMessage += "Reject?";
      Status = 4;
    } else {
      confirmMessage += "Approve?";
      Status = 3;
    }
    Swal.fire({
      title: "Are you sure?",
      text: confirmMessage,
      icon: e.currentTarget.id == "btnReject" ? "warning" : "success",
      showCancelButton: true,
      confirmButtonColor:
        e.currentTarget.id == "btnReject" ? "#3085d6" : "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText:
        e.currentTarget.id == "btnReject" ? "Reject" : "Approve",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await WebService({
          endPoint: `UserProfile/UpdateEmployeeDocument/${DocumentId}/${Status}`,
          body: {},
          dispatch,
        });
        fetchEmployeeDocuments();
        const details = await WebService({
          endPoint: `userProfile/FetchDocType/${DocumentId}`,
          dispatch,
        });
        setInformation(details);
        createNotification();
      }
    });
  };

  const fetchFamily = async () => {
    const data = await WebService({
      endPoint: `FamilyDetails/FetchFamilyDetails/${EmpId || 0}`,
      dispatch,
    });
    setInfo(data.FamilyDetails);
  };

  const onRemove = async (FamilyId) => {
    await WebService({
      endPoint: `FamilyDetails/Remove/${FamilyId}`,
      method: "DELETE",
      dispatch,
    });
    await fetchFamily();
  };
  const myFunction = async (e) => {
    const RelationShip = e.target.value;
    setShow(RelationShip);
  };

  // const onSubmitDocument = async (data) => {
  //   const formData = new FormData();
  //   formData.append("image", file);
  //   formData.append("EmployeeId", records[0].EmployeeId);
  //   try {
  //     await axios({
  //       method: "post",
  //       dispatch,
  //       url: "http://localhost:3001/upload/uploadProfile",
  //       data: formData,
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const onSubmitDocument = async (data) => {
    const imgfilename = await WebService({
      endPoint: "upload/File",
      body: file,
      dispatch,
      isFile: true,
    }).then((res) => res.filename);
    
    let userphotodata={
      ProfileimgName:imgfilename,
      userId:records[0]?.EmployeeId,
    };
    const responsedata = await WebService({
      endPoint: "UserProfile/UpdateProfile",
      body:userphotodata,
      dispatch,
    });
    // .then((res) => {
    //   Swal.fire({
    //     title: "Profile",
    //     text: "Photo Updated",
    //     icon: "info",
    //   });
    //   fetchProfile();
    // });

  };

  // const onSubmitDocument = async (data) => {
  //   data.FilePath = await WebService({
  //     endPoint: "upload/File",
  //     dispatch,
  //     body: data.File,
  //     isFile: true,
  //   }).then((res) => res.filename);
  //   await WebService({
  //     dispatch,
  //     endPoint: "User/Document",
  //     body: extend(omit(data, ["File"]), { EmployeeId }),
  //   });
  //   await getDocuments();
  //   resetDocumentForm.current.fnReset({ File: null });
  // };
  const addEditModalRef = useRef();
  const confirmMessage = " Deleted successfully";
  const fnEdit = async (id) => await addEditModalRef.current.openModal(id || 0);
  const columns = [
    {
      Text: "Document Name",
      Value: "DocumentType",
    },
    {
      Text: "Document Number",
      Value: "Number",
    },
    {
      Text: "Status",
      Value: "Status",
    },
    {
      Text: "Action",
      key: "DocumentId",
      cssClass: "text-end",
      isVisiable:
        permission.ManageReject ||
        permission.ManageApprove ||
        permission.ManageView,
      Template: (
        <>
          <ActionButton
            onClick={(e) =>
              onView(e.currentTarget.parentElement.getAttribute("data-key"), e)
            }
            disabled={!permission.ManageView}
            IconName="View"
            id="btnView"
            className={`${!permission.ManageView ? "d-none" : "d-inline"}`}
          />

          <button
            id="btnApprove"
            className={`btn btn-default mx-2 p-0 border-none ${
              !permission.ManageApprove ? "d-none" : "d-inline"
            }`}
            onClick={(e) =>
              onApproveReject(
                e.currentTarget.parentElement.getAttribute("data-key"),
                e
              )
            }
          >
            <i className="fa fa-check-circle text-primary"></i>
          </button>
          <button
            id="btnReject"
            className={`btn btn-default mx-2 p-0 border-none ${
              !permission.ManageReject ? "d-none" : "d-inline"
            }`}
            onClick={(e) =>
              onApproveReject(
                e.currentTarget.parentElement.getAttribute("data-key"),
                e
              )
            }
          >
            <i className="fa fa-ban text-danger"></i>
          </button>
        </>
      ),
    },
  ];
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const details = [
    {
      Text: "Name",
      Value: "Name",
    },
    {
      Text: "Relation",
      Value: "Relation",
    },
    {
      Text: "Age",
      Value: "Age",
    },
    {
      Text: "Gender",
      Value: "Gender",
    },
    {
      Text: "Blood Group",
      Value: "BloodGroup",
    },
    {
      Text: "Action",
      key: "FamilyId",
      cssClass: "text-center td-width-100",
      //isVisiable: permission.ManageEdit || permission.ManageDelete,
      Template: (
        <>
          <ActionButton
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
            // disabled={!permission.ManageEdit}
            IconName="Edit"
            id="btnFamilyEdit"
          />

          <ActionButton
            onClick={(e) =>
              ref.current.confirmAlert(
                "Delete", //Confirm button text
                "Are You Sure", // Text if Alert
                "Do you want to delete ", // Message of Alert
                e.currentTarget.parentElement.getAttribute("data-key") // Endpoint to hit for delete
              )
            }
            //disabled={!permission.ManageDelete}
            IconName="Delete"
            id="btnFamilyDelete"
          />
        </>
      ),
    },
  ];
  const GetTokenComponentRef = useRef();
  return (
    <>
      <Container className="base-container" fluid>
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <img src={` ${StandardConst.uploadImages}${viewDoc}`} />
            </Box>
          </Modal>
        </div>
        <form onSubmit={handleSubmit}>
          {records.map((user) => (
            <div>
              <div key={user.EmpId}>
                <div className="row p-0 equal mb-2">
                  <div className="col-md-4 ">
                    <div className="card shadow-none border-0 border-end border-bottom bg-light footer-widget">
                      <div className="card-body">
                        <div className="d-flex flex-column align-items-center text-center">
                          <div className="pic-holder">
                          <img
                                  className="pic rounded-circle p-1"
                                  src={`${StandardConst.apiBaseUrl}/uploads/${dp ?? "" }`}
                                  alt="logo"
                          /> 

                            <input
                              className="uploadProfileInput"
                              type="file"
                              name="File"
                              id="newProfilePhoto"
                              accept="image/*"
                              style={{ opacity: "0" }}
                              onChange={saveFile}
                            />
                            <label
                              htmlFor="newProfilePhoto"
                              className="upload-file-block"
                            >
                              <div className="text-center">
                                <div className="mb-2">
                                  <i className="fa fa-camera fa-2x"></i>
                                </div>
                                <div className="text-uppercase">
                                  Update <br /> Profile Photo
                                </div>
                              </div>
                            </label>
                          </div>
                          <button
                            className="btn btn-outline-primary"
                            id="btnProfileUpload"
                            onClick={onSubmitDocument}
                          >
                            {" "}
                            Upload
                          </button>
                          <div className="mt-1">
                            <h4>{user.FullName}</h4>
                            <p className="text-secondary mb-1">
                              {user.Designation}
                            </p>
                            <p className="text-muted font-size-sm">
                              Code: {user.EmployeeCode}
                            </p>

                            <button
                              onClick={GetTokenComponentRef.current.getToken}
                              className="btn btn-success mx-2"
                            >
                              {" "}
                              <i
                                class="fa fa-share-alt"
                                aria-hidden="true"
                              ></i>{" "}
                              Generate Token
                            </button>
                          </div>

                          {/* <hr className="my-4" /> */}
                          {/* <ul className="list-group list-group-flush">
                          <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                            <h6 className="mb-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-globe me-2 icon-inline"
                              >
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                              </svg>
                              Website
                            </h6>
                            <span className="text-secondary">
                              https://bootdey.com
                            </span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                            <h6 className="mb-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-github me-2 icon-inline"
                              >
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                              </svg>
                              Github
                            </h6>
                            <span className="text-secondary">bootdey</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                            <h6 className="mb-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-twitter me-2 icon-inline text-info"
                              >
                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                              </svg>
                              Twitter
                            </h6>
                            <span className="text-secondary">@bootdey</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                            <h6 className="mb-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-instagram me-2 icon-inline text-danger"
                              >
                                <rect
                                  x="2"
                                  y="2"
                                  width="20"
                                  height="20"
                                  rx="5"
                                  ry="5"
                                ></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line
                                  x1="17.5"
                                  y1="6.5"
                                  x2="17.51"
                                  y2="6.5"
                                ></line>
                              </svg>
                              Instagram
                            </h6>
                            <span className="text-secondary">bootdey</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                            <h6 className="mb-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-facebook me-2 icon-inline text-primary"
                              >
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                              </svg>
                              Facebook
                            </h6>
                            <span className="text-secondary">bootdey</span>
                          </li>
                        </ul> */}
                        </div>
                      </div>

                      <div className="card-footer mt-2">
                        <div className="d-flex  justify-content-around">
                          <button
                            type="submit"
                            id="btnSubmit"
                            className="btn btn-primary mx-2"
                          >
                            <i
                              class="fa fa-cloud-download"
                              aria-hidden="true"
                            ></i>{" "}
                            ID Card
                          </button>
                          <button
                            type="submit"
                            id="btnSubmit"
                            className="btn btn-success mx-2"
                            value="Save Changes"
                          >
                            {" "}
                            <i
                              class="fa fa-share-alt"
                              aria-hidden="true"
                            ></i>{" "}
                            ID Card
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="card shadow-none border-0  border-start border-bottom   footer-widget">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Full Name</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            <input
                              type="hidden"
                              id="EmpId"
                              value={user.EmpId}
                            />

                            <input
                              type="text"
                              className="form-control"
                              id="FullName"
                              defaultValue={user.FullName}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Email</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            <input
                              type="text"
                              className="form-control"
                              id="Email"
                              defaultValue={user.Email}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Phone</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            <input
                              type="text"
                              className="form-control"
                              id="Phone"
                              defaultValue={user.Phone}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Emergency Phone</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            <input
                              type="text"
                              className="form-control"
                              id="EmergencyPhone"
                              defaultValue={user.EmergencyPhone}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Permanent Address</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            <input
                              type="text"
                              className="form-control"
                              id="PermanentAddress"
                              defaultValue={user.PermanentAddress}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Address</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            <input
                              type="text"
                              className="form-control"
                              id="CommunicationAddress"
                              defaultValue={user.CommunicationAddress}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Qualification</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            <input
                              type="text"
                              className="form-control"
                              id="Qualifications"
                              defaultValue={user.Qualifications}
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Date Of Birth</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            <input
                              type="date"
                              className="form-control"
                              id="DOB"
                              defaultValue={user.DOB}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Date Of Joining</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            <input
                              type="date"
                              className="form-control"
                              id="DOJ"
                              defaultValue={user.DOJ}
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">RelationShip Status</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            {user.Anniversary > "01-01-1970" ? (
                              <select
                                id="RelationShip"
                                className="form-control"
                                onChange={myFunction}
                                disabled
                              >
                                <option value="Married">Married</option>
                              </select>
                            ) : (
                              <select
                                id="RelationShip"
                                className="form-control"
                                onChange={myFunction}
                              >
                                <option value="UnMarried">UnMarried</option>
                                <option value="Married">Married</option>
                              </select>
                            )}
                          </div>
                        </div>

                        {show == "Married" ||
                        user.Anniversary > "01-01-1970" ? (
                          <div className="row">
                            <div className="col-sm-3">
                              <h6>Anniversary Date</h6>
                            </div>
                            <div className="col-sm-9 text-secondary">
                              <input
                                type="date"
                                className="form-control"
                                id="Anniversary"
                                defaultValue={user.Anniversary}
                              />
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="card-footer mt-2">
                        <input
                          type="submit"
                          id="btnSubmit"
                          className="btn btn-primary px-4 w-25 float-end"
                          value="Save Changes"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </form>
        <div>
          {records.map((user) => (
            <div key={user.EmpId}>
              <div>
                <Paper elevation={1} className="mb-3">
                  <Alert severity="info">
                    <strong>Documents</strong>
                  </Alert>
                  <TableComponent
                    columns={columns}
                    data={doc}
                    IsAddButtonVisible={false}
                    isSearchRequired={false}
                  />
                </Paper>
                <DeleteConfirmAlert
                  ref={ref}
                  confirmEvent={(v) => onRemove(v)}
                />
                <Paper elevation={2} className="mb-2">
                  <Alert>
                    <strong>Family Details</strong>
                  </Alert>

                  <TableComponent
                    columns={details}
                    data={info}
                    onAddEvent={() => fnEdit()}
                    isSearchRequired={true}
                  />
                  <AddEditFamilyDetails
                    callBackEvent={() => fetchFamily()}
                    ref={addEditModalRef}
                  ></AddEditFamilyDetails>
                </Paper>
                <div className="row mb-2">
                  <div
                    className={`col-sm-12 ${
                      records[0].StatusId == 3 ? "d-none" : ""
                    }`}
                  >
                    <Form
                      defaultValues={approvedData}
                      onSubmit={onApprovalSubmit}
                      validationSchema={schema}
                    >
                      <Paper elevation={1} className="mt-2">
                        <Alert severity="info">
                          <strong> Select Manager & Approve Employee</strong>
                        </Alert>
                        <div className="row text-center">
                          <div className="col-md-4 mt-3">
                            <InputDropdown
                              name="ManagerId"
                              id="ManagerId"
                              ddOpt={ManagerData}
                              label="Select Manager"
                              setValue={(v) =>
                                setData({ ...ApproveData, ManagerId: v })
                              }
                            ></InputDropdown>
                          </div>

                          <div className="col-md-5  mt-3">
                            <FormInputText
                              label="Remarks"
                              id="ApproveRejectReason"
                              name="ApproveRejectReason"
                              type="text"
                            />
                          </div>
                          <div className="col-md-2  mt-3">
                            <ButtonGroup
                              disableElevation
                              variant="outlined"
                              color="primary"
                              aria-label="Disabled elevation buttons"
                            >
                              <MButton
                                type="button"
                                id="btnApproveRejectEmployee"
                                onClick={() => approveRejectEmployee(3)}
                              >
                                Approve
                              </MButton>
                              <MButton
                                className="text-danger"
                                id="btnProfileReject"
                                onClick={() => approveRejectEmployee(4)}
                              >
                                Reject
                              </MButton>
                            </ButtonGroup>
                          </div>
                        </div>
                      </Paper>
                    </Form>

                    <ViewDocument ref={viewModalRef} />
                  </div>
                </div>

                <div className="row mb-2">
                  <div
                    className={`col-sm-12 ${
                      records[0].StatusId == 3 ? "d-none" : ""
                    }`}
                  >
                    <Form
                      defaultValues={approvelocationData}
                      validationSchema={schema}
                    >
                      <Paper elevation={1}>
                        <Alert severity="info">
                          <strong>Assign Employee Office location</strong>
                        </Alert>
                        <div className="row text-center">
                          <div className="col-md-4 mt-3">
                            <InputDropdown
                              name="OfficeLocationId"
                              id="OfficeLocationId"
                              ddOpt={locationData}
                              label="Select Location"
                              setValue={(v) =>
                                setlocatiinData({
                                  ...officelocationData,
                                  OfficeLocationId: v,
                                })
                              }
                            ></InputDropdown>
                          </div>

                          <div className="col-md-5  mt-3">
                            <FormInputText
                              label="Remarks"
                              id="Assignlocation"
                              name="Assignlocation"
                              type="text"
                            />
                          </div>
                          <div className="col-md-2  mt-3">
                            <ButtonGroup
                              disableElevation
                              variant="outlined"
                              color="primary"
                              aria-label="Disabled elevation buttons"
                            >
                              <MButton
                                type="button"
                                id="btnAssignOfficelocation"
                                onClick={() => assignOfficelocation()}
                              >
                                Assign
                              </MButton>
                            </ButtonGroup>
                          </div>
                        </div>
                      </Paper>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
      <GetTokenComponent ref={GetTokenComponentRef} />
    </>
  );
};

const GetTokenComponent = forwardRef(({}, ref) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const dispatch = useDispatch();
  const [tokenValue, setTokenValue] = useState("");
  const [open, setOpen] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(tokenValue);
    alert("Token number copied");
  };
  const getToken = () => {
    WebService({ dispatch, endPoint: "User/Token" }).then((c) => {
      console.log(c);
      setTokenValue(c);
      handleOpen();
    });
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useImperativeHandle(
    ref,
    () => ({
      getToken,
    }),
    []
  );
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Token Number
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <InputText as="textarea" value={tokenValue} readOnly={true} />

          <button onClick={copy} className="btn btn-success">
            <i class="fa fa-copy" aria-hidden="true"></i> Copy Generate Token
          </button>
        </Typography>
      </Box>
    </Modal>
  );
});

export default Profile;
