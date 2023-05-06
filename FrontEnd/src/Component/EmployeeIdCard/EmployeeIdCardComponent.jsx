import React, { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Form, FormInputDropdown, FormInputText } from "../Form";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { StandardConst } from "../../Services/StandardConst";
import * as yup from "yup";
import { WebService } from "../../Services/WebService";
import { useDispatch, useSelector } from "react-redux";
import { DateTime, Info } from "luxon";
import _ from "underscore";
import TableComponent from "../../Services/TableComponent";
import { ActionPermission, PageInfo } from "../PageInfo";
import format from "date-fns/format";
import "./dateCss.css";
import {
  Alert,
  Avatar,
  Box,
  ButtonGroup,
  Modal,
  Paper,
  Typography,
} from "@mui/material";

const EmployeeIdCardReport = () => {
    PageInfo({ pageTitle: "Employee Id Card Report" });

  const [filter, setFilter] = useState({
    FromDate: DateTime.local().toFormat("yyyy-MM-dd"),
    ToDate: DateTime.local().toFormat("yyyy-MM-dd"),
  });
  const [data, setData] = useState(null);
  const [expireDate, setExpireDate] = useState();
  const [formdate, setFromdate] = useState(null);
  const [todate, setTodate] = useState(null);
  const [persons, setPersons] = useState([]);
  const renderAfterCalled = useRef(false);
  const [dp, setDp] = useState([]);
  const dispatch = useDispatch();
  const [IdCardinfo, setIdCardInfo] = useState([]);


  
  const onSubmit = async (rec) => {
    
    if ((rec?.ExpireDate || "") !== "")
    rec.ExpireDate = format(new Date(rec.ExpireDate), "yyyy-MM-dd");

    setExpireDate(rec.ExpireDate);
    const data = await WebService({
      endPoint: "EmployeeIdCard/FetchCard",
      body: rec,
      dispatch,
    });
    
    if ((data?.DOB || "") !== "")
      data.DOB = format(new Date(data.DOB), "yyyy-MM-dd");
    setDp(data?.ProfileImage ?? null);
    console.log("check",data);
    setData(data);
  };

  const Print = () =>{     
    let printContents = document.getElementById('EmpIdCard').innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
   document.body.innerHTML = originalContents; 
  }

  const fetchIdCardList = async () => {
    const data = await WebService({
      endPoint: `EmployeeIdCard/FetchActiveIdCard`,
      dispatch,
    });    
    if ((data?.DOB || "") !== "")
      data.DOB = format(new Date(data.DOB), "yyyy-MM-dd");
    setIdCardInfo(data.IdCardDetails);
  };

  const fetchPersonList = async () => {
    var opt = { endPoint: "User/ActiveUserList", dispatch };
    // if (permission.ManageSearchAllUsers) opt.endPoint += "?user=all";
    // else if (permission.ManageReportingUser) opt.endPoint += "?user=manage";
    // else opt.endPoint += "?user=own";

    const res = await WebService(opt);
    setPersons(
      [...persons].concat(
        (res ?? []).map((m) => {
          return {
            value: m.EmployeeId,
            text: m.FullName,
          };
        })
      )
    );
  };
  const init = () => {
    // fetchProjectList();
    fetchIdCardList();
    fetchPersonList();
  };
  useEffect(() => {
    if (!renderAfterCalled.current) {
      init();
    }
    renderAfterCalled.current = true;
  }, []);

  const requiredMessage = "This is a required field";
  const schema = yup
    .object()
    .shape({
      ExpireDate: yup
        .date()
        .label("Expire Date")
        .typeError(requiredMessage)
        .required(),
    })
    .required();
  const filterChange = () => {
    setData(null);
  };
  useEffect(() => {
    setFromdate(filter.FromDate);
  }, [filter.FromDate]);
  useEffect(() => {
    setTodate(filter.ToDate);
  }, [filter.ToDate]);



  const IdCarddetails = [
    {
      Text: "Name",
      Value: "FullName",
    },
    {
      Text: "Employee Code",
      Value: "EmployeeCode",
    },
    {
      Text: "Phone",
      Value: "Phone",
    },
    {
      Text: "Location",
      Value: "Location",
    },
    {
      Text: "ID Card Expire Date",
      Value: "ExpireDate",      
      DateFormat: "yyyy-MM-dd",
    },
  ];


  const filterComponent = (
    <>
      {data === null && (
        <div>
          <h3 class="px-4">Create Employee ID Card</h3>
        <div style={{ backgroundColor: "#1976D2" }} className="pt-4 px-4">   
              <Form
                defaultValues={filter}
                onSubmit={onSubmit}
                validationSchema={schema}
              >
                <Row className="mt-2">
                  <Col md={4}>
                    <FormInputDropdown
                      name="EmployeeId"
                      ddOpt={persons ?? []}
                      label="Employee"
                      labelCss="text-light"
                    />
                  </Col>
                  <Col md={4}>
                    <FormInputText
                      name="ExpireDate"
                      type="date"
                      label="Expire Date"
                      labelCss="text-light"
                      min={new Date().toISOString().split("T")[0]}
                      max="2999-12-31"  
                    />
                  </Col>                  
                  <Col md={4}>
                    <Button
                      id="btnCreateIDCard"
                      variant="outline-light"
                      type="submit"
                      className="float-end"
                    >
                      Create ID Card
                    </Button>
                  </Col>
                </Row>
              </Form>
              </div>
        </div>
      )}
      {IdCardinfo !== null && (
        <div>
           <Paper elevation={2} className="mb-2">
                <Alert>
                  <strong>Active ID Card</strong>
                </Alert>

                <TableComponent
                  columns={IdCarddetails}
                  data={IdCardinfo}
                 // onAddEvent={() => fnEdit()}
                  isSearchRequired={false}
                  IsAddButtonVisible={false}
                />
              </Paper>
             
        </div>
      )}

    </>
  );
  const reportResultComponent = (
    <>
      {data !== null && (
        <div>
          <Row>
            <Col>
              <div className="float-start">
                <span className="h3 me-2">Employee ID Card</span>
              </div>

              <div className="float-end">
                <Button
                  id="btnAttendanceFilter"
                  variant="outline-primary"
                  onClick={filterChange}
                >
                  Create ID Card
                </Button>
              </div>
            </Col>
          </Row>
          <hr></hr>
          <div>
            <Row>
              <Col>
                <Row>  
                   <div className="row p-0" id="EmpIdCard">
              
              <div className="col-md-12">
                <div className="card">
                  
        {data.map((user) => (
                  <div className="card-body">  
                                  
                      <div className="row">
                        <div className="col-sm-3 text-secondary">                          
                          <img src="WiseLogoFinal.png" height="25" width="auto" />
                        <div className="col-sm-9"></div>
                      </div>
                      </div>  
                      <hr></hr>
                      <div className="row">
                        <div className="col-sm-9">         
                    <div className="row">                      
                      <div className="col-sm-6">
                        <h6 className="mb-0">Employee Code : {user.EmployeeCode}</h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <h6 className="mb-0">Full Name : {user.FullName}</h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <h6 className="mb-0">Email : {user.EmployeeEmail}</h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <h6 className="mb-0">Phone :{user.Phone}</h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <h6 className="mb-0">Date Of Birth : {user.DOB}</h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <h6 className="mb-0">Expire Date : {expireDate}</h6>
                      </div>
                    </div>
                    </div> 
                    <div className="col-sm-3">
                      <div className="card">
                  <div className="card-body">
                    <div className="d-flex flex-column align-items-center text-center">
                        <img
                          id="profilePic"
                          src={`${StandardConst.apiBaseUrl}/uploads/${user.ProfileImage ?? "" }`}
                        />
                    </div>
                  </div>
                </div>

                    </div>
                    </div>
                    <hr></hr>
                    <div className="row">
                      <div className="col-sm-12">
                        <h6 className="mb-0">Address :{user.CompanyName}, {user.Address1},{user.city},{user.State},{user.pincode}</h6>                        
                        <h6 className="mb-0">Contact : {user.CompanyEmail},{user.CompanyPhone}</h6>
                      </div>
                    </div>
                    
                  </div>
        ))}
                </div>
              </div>
            </div>
          
            <div className="row">
                      <div className="col-sm-9"></div>
                      <div className="col-sm-3 text-secondary text-end">
                      <button className="btn btn-primary px-4" type="button" onClick={Print} > Print</button>
                      </div>
                    </div>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </>
  );
  
  const ActiveIdCardComponent = (
    <>
      {IdCardinfo !== null && (
        <div>
           <Paper elevation={2} className="mb-2">
                <Alert>
                  <strong>Active ID Card</strong>
                </Alert>

                <TableComponent
                  columns={IdCarddetails}
                  data={IdCardinfo}
                 // onAddEvent={() => fnEdit()}
                  isSearchRequired={false}
                  IsAddButtonVisible={false}
                />
              </Paper>
             
        </div>
      )}
    </>
  );
  return (
    <>
      <Container
        fluid
        className="p-4"
        style={{
          backgroundColor: "#FFF",
          borderRadius: "10px ",
          margin: "10px",
        }}
      >
        {filterComponent}
        {reportResultComponent}
       
      </Container>
    </>
  );
};

export default EmployeeIdCardReport;
