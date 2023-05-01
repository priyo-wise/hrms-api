import React from "react";
import Container from "react-bootstrap/esm/Container";
import "../../Static/Static.css";
import SalaryTemplate from "./SalaryTemplate";
import SalaryTemplateComponent from "./SalaryTemplateComponents";
import { Tab, Tabs, Box, AppBar, Toolbar, Paper } from "@mui/material";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views-react-18-fix";
import Topbar from "../../../Services/TopbarComponent";
import ViewList from "@mui/icons-material/ViewList";
import ModeEdit from "@mui/icons-material/ModeEdit";
import { useTheme } from "@mui/material/styles";

const SalaryComponent = () => {
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
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
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
      title: "Template",
      hrefLink: "#",
    },
  ]);
  return (
    <>
      {/* <Container
        className="p-4"
        style={{
          "background-color": "#FFF",
          "border-radius": "10px ",
          margin: "10px",
        }}
      >
        <Row>
          <Tabs
            defaultActiveKey="Salary Template"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="Salary Template" title="Salary Template">
              <SalaryTemplate />
            </Tab>

            <Tab
              eventKey="Salary Template Component"
              title="Salary Template Component"
            >
              <SalaryTemplateComponent />
            </Tab>
          </Tabs>
        </Row>
      </Container> */}

      <Container
        fluid
        style={{
          padding: "0px",
          "background-color": "#FFF",
          "border-radius": "5px ",
          margin: "10px",
        }}
      >
        <Topbar bData={bData} HeadingText="Salary Template"></Topbar>
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
                label="Salary Template"
                iconPosition="start"
              />
              <Tab
                icon={<ModeEdit />}
                aria-label="favorite"
                label="Salary Template Component"
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
              <SalaryTemplate />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <SalaryTemplateComponent />
            </TabPanel>
          </SwipeableViews>
        </Box>
      </Container>
    </>
  );
};

export default SalaryComponent;
