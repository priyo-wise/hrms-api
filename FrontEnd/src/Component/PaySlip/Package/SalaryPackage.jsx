import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Container from "react-bootstrap/esm/Container";
import { useDispatch } from "react-redux";
import { sortBy } from "underscore";
import { WebService } from "../../../Services/WebService";
import IconButton from "@mui/material/IconButton";
import { Delete, Edit } from "@mui/icons-material";
import { DateTime } from "luxon";
import ViewList from "@mui/icons-material/ViewList";
import ModeEdit from "@mui/icons-material/ModeEdit";
import { Tab, Tabs, Box, AppBar, Toolbar, Paper } from "@mui/material";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views-react-18-fix";
import { useTheme } from "@mui/material/styles";
import Topbar from "../../../Services/TopbarComponent";
import AddEditComponent from "./AddEditEmpSalaryPackage";
import { pink } from "@mui/material/colors";
import TableComponent from "../../../Services/TableComponent";
import { ActionPermission, PageInfo } from "../../PageInfo";
import ActionButton from "../../../Services/ActionButton";

const SalaryPackage = () => {
  PageInfo({ pageTitle: "Salary Package" });
  const [key, setKey] = useState("PackageList");
  const refPackageList = useRef();
  const refPackageAddEdit = useRef();
  const tabSelectEvent = (k) => {
    setKey(k);
    if (k == "PackageList") {
      refPackageList.current.fetchList();
    } else {
      refPackageAddEdit.current.editPackage();
    }
  };

  //Tab Panel Start
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
  const [bData, setBData] = React.useState([
    {
      title: "Salary",
      hrefLink: "#",
    },
    {
      title: "Package",
      hrefLink: "#",
    },
  ]);
  //Tab Panel End
  return (
    <>
      <Container
        fluid
        style={{
          padding: "0px",
          "background-color": "#FFF",
          "border-radius": "5px ",
          margin: "10px",
        }}
      >
        <Topbar bData={bData} HeadingText="Employee Package"></Topbar>
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
                icon={<ViewList />}
                aria-label="phone"
                label="Package List"
                iconPosition="start"
              />
              <Tab
                icon={<ModeEdit />}
                aria-label="favorite"
                label="Package Creation"
                iconPosition="start"
              />
              <Toolbar> </Toolbar>
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              {" "}
              <PackageList
                ref={refPackageList}
                editItem={(id) => {
                  setKey("AddEdit");
                  refPackageAddEdit.current.editPackage(id);
                }}
              />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              {" "}
              <AddEditComponent ref={refPackageAddEdit} />
            </TabPanel>
          </SwipeableViews>
        </Box>

        {/* <Tabs
          activeKey={key}
          id="uncontrolled-tab-example"
          className="mb-3"
          onSelect={(k) => tabSelectEvent(k)}
        >
          <Tab eventKey="PackageList" title="Package List">
            <PackageList
              ref={refPackageList}
              editItem={(id) => {
                setKey("AddEdit");
                refPackageAddEdit.current.editPackage(id);
              }}
            />
          </Tab>
          <Tab eventKey="AddEdit" title="Package Creation">
            <AddEditComponent ref={refPackageAddEdit} />
          </Tab>
        </Tabs> */}
      </Container>
    </>
  );
};

const PackageList = forwardRef(({ editItem }, ref) => {
  const [dataSet, setDataSet] = useState([]);
  const afterRender = useRef(false);
  const dispatch = useDispatch();
  const endPoint = "EmployeePackage";
  const [permission] = useState({
    ManageAdd: ActionPermission("Salary Package - Add"),
    ManageEdit: ActionPermission("Salary Package - Edit"),
    // ManageSearch: ActionPermission("Salary Package - Search AllUser"),
  });
  const fetchList = () =>
    WebService({ endPoint, dispatch }).then((d) =>
      setDataSet(sortBy(sortBy(d || [], "EmpName"), "FromDate").reverse())
    );
  const displayDateFormat = (dt, format) => {
    if (dt === undefined || dt === null) return null;
    return DateTime.fromISO(dt).toFormat(format);
  };
  const fnDelete = (id) => {
    WebService({
      endPoint: `${endPoint}/${id}`,
      method: "DELETE",
      dispatch,
    }).then((_) => fetchList());
  };
  useEffect(() => {
    if (!afterRender.current) {
      fetchList();
    }
    afterRender.current = true;
  }, []);
  useImperativeHandle(ref, () => ({
    fetchList,
  }));
  var columns = [
    {
      Text: "From Date",
      DateFormat: "yyyy-MM-dd",
      Value: "FromDate",
    },
    {
      Text: "To Date",
      DateFormat: "yyyy-MM-dd",
      Value: "ToDate",
    },
    {
      Text: "Person",
      Value: "EmpName",
    },
    {
      Text: "Template",
      Value: "TemplateName",
    },
    {
      Text: "Payment Frequency",
      Value: "SalaryPaymentFrequency",
    },
    {
      Text: "CTC",
    },
    {
      Text: "Total Earning",
      Value: "TotalEarning",
    },
    {
      Text: "Total Deduction",
      Value: "TotalDeduction",
    },
    {
      Text: "Action",
      render: (obj) => (
        <>
           {DateTime.fromISO(obj.FromDate) > DateTime.now() && ( 
            <>
              <IconButton
                size="small"
                color="primary"
                onClick={() => editItem(obj.EmployeePackageId)}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: pink[500] }}
                onClick={() => fnDelete(obj.EmployeePackageId)}
              >
                <Delete fontSize="small" />
              </IconButton>
            </>
           )} 
        </>
      ),
    },
  ];
  return (
    <>
      <TableComponent
        columns={columns}
        data={dataSet}
        IsAddButtonVisible={false}
        isSearchRequired={true}
      />
    </>
  );
});

export default SalaryPackage;
