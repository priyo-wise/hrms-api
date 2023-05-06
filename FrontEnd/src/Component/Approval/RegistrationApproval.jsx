import React, { useEffect, memo, useState, useRef } from "react";
import { WebService } from "../../Services/WebService";
import { PageInfo } from "../PageInfo";
import { useDispatch } from "react-redux";
import Container from "react-bootstrap/Container";
import TableComponent from "../../Services/TableComponent";
import { useNavigate } from "react-router-dom";
import CheckBox from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import Pending from "@mui/icons-material/Pending";
import { Tab, Tabs, Box, AppBar, Toolbar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SwipeableViews from "react-swipeable-views-react-18-fix";
import { useTheme, styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import PropTypes from "prop-types";
import Topbar from "../../Services/TopbarComponent";
const RegistrationApproval = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  PageInfo({ pageTitle: "Registration Approval" });
  const [records, setRecords] = useState([]);
  const [approvedRecords, setApprovedRecords] = useState([]);
  const [rejectedRecords, setRejectedRecords] = useState([]);

  const fetchRegistrationApprovalList = async () => {
    const details = await WebService({
      endPoint: "Registration/Fetch",
      dispatch,
    });
    setRecords(details.data);
  };
  const FetchByStatus = async (id) => {
    const details = await WebService({
      endPoint: `Registration/FetchByStatus/${id}`,
      dispatch,
    });
    if (id == 3) {
      setApprovedRecords(details);
    } else if (id == 4) {
      setRejectedRecords(details);
    }
  };
  //Tabs start

  const [bData, setBData] = React.useState([
    {
      title: "Report",
      hrefLink: "#",
    },
    {
      title: "Employee",
      hrefLink: "#",
    },
  ]);
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 0, mt: 0 }}>
            <span>{children}</span>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };

  //Tab End

  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchRegistrationApprovalList();
      FetchByStatus(3);
      FetchByStatus(4);
    }
    renderAfterCalled.current = true;
  }, []);

  const columns = [
    {
      Text: "Full Name",
      Value: "FullName",
    },
    {
      Text: "Father Name",
      Value: "FatherName",
    },
    {
      Text: "Code",
      Value: "Email",
    },
    {
      Text: "Phone",
      Value: "Phone",
    },
    {
      Text: "Action",
      //isVisiable: permission.ManageEdit || permission.ManageDelete,
      render: (dr) => (
        <>
          <button
            className="btn btn-default text-primary"
            id="btnRegistrationApprovalView"
            onClick={() => fnEdit(dr.EmployeeId)}
            //disabled={!permission.ManageEdit}
          >
            <i className="fa fa-eye"></i>
          </button>
        </>
      ),
    },
  ];

  const fnEdit = async (EmpId) => {
    navigate("/Common/Profile", { state: { EmpId } });
  };
  return (
    <>
      <Container
        fluid
        style={{
          padding: "0px",
          "background-color": "#FFF",
          "border-radius": "5px ",
          margin: "10px",
          backgroundColor: "#fff",
        }}
      >
        <Topbar bData={bData} HeadingText="Employee"></Topbar>
        <Box>
          <AppBar position="static" color="info" elevation={0}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab
                icon={<CheckBox />}
                aria-label="phone"
                label="Approved"
                iconPosition="start"
              />
              <Tab
                icon={<Cancel />}
                aria-label="favorite"
                label="Rejected"
                iconPosition="start"
              />
              <Tab
                icon={<Pending />}
                aria-label="person"
                label="Pending"
                iconPosition="start"
              />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              {" "}
              <TableComponent
                columns={columns}
                data={approvedRecords}
                IsAddButtonVisible={false}
                isSearchRequired={true}
              />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <TableComponent
                columns={columns}
                data={rejectedRecords}
                IsAddButtonVisible={false}
                isSearchRequired={true}
              />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <TableComponent
                columns={columns}
                data={records}
                IsAddButtonVisible={false}
                isSearchRequired={true}
              />
            </TabPanel>
          </SwipeableViews>
        </Box>
      </Container>
    </>
  );
};

export default memo(RegistrationApproval);
