import React from "react";
import Container from "react-bootstrap/esm/Container";
// import Row from "react-bootstrap/esm/Row";
// import Tab from "react-bootstrap/Tab";
// import Tabs from "react-bootstrap/Tabs";
import "../../Static/Static.css";
import Salary from "./Salary";
import Calculation from "./CalculationComponent";
import Topbar from "../../../Services/TopbarComponent";
import ViewList from "@mui/icons-material/ViewList";
import ModeEdit from "@mui/icons-material/ModeEdit";
import { Tab, Tabs, Box, AppBar, Toolbar, Paper } from "@mui/material";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views-react-18-fix";
import { useTheme } from "@mui/material/styles";
import BottomNavigationComponent from "../../../Services/BottomNavigationComponent";
const SalaryComponent = () => {
  //Tab Panel Start
  const [bData, setBData] = React.useState([
    {
      title: "Salary",
      hrefLink: "#",
    },
    {
      title: "Component",
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
  //Tab Panel End
  return (
    <>
      <Container
        style={{
          padding: "0px",
          "background-color": "#FFF",
          "border-radius": "5px ",
          margin: "10px",
        }}
      >
        <Topbar bData={bData} HeadingText="Salary Component"></Topbar>
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
                label="Salary Component"
                iconPosition="start"
                id="SalaryComponent"
              />
              <Tab
                icon={<ModeEdit />}
                aria-label="favorite"
                label="Calculation"
                iconPosition="start"
                id="Calculation"
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
              <Salary />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              {" "}
              <Calculation />
            </TabPanel>
          </SwipeableViews>
        </Box>
      </Container>
    </>
  );
};

export default SalaryComponent;
