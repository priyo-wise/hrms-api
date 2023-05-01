import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import Auth from "./Auth";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Services/Store";
import LogIn from "./Component/LogIn/LogInComponent";
import ApplyLeave from "./Component/Leave/Applyleave";
import AllApplyleavelist from "./Component/Leave/AllApplyleavelist";
import PerformanceComponent from "./Component/Performance/PerformanceComponent";
import PaySlipComponent from "./Component/PaySlip/PaySlipComponent";
import DashboardComponent from "./Component/Dashboard/DashboardComponent";
import Dashboard from "./Component/Dashboard/DashboardComponent";
import ChangePasswordComponent from "./Component/LogIn/ChangePasswordComponent";
import JobFunction from "./Component/Static/JobFunctions";
import Document from "./Component/Static/DocumentType";
import KeyRating from "./Component/Static/KRA";
import LeaveType from "./Component/Static/LeaveType";
import Permission from "./Component/Static/Permission";
import Roles from "./Component/Static/Roles";
import Status from "./Component/Static/StatusType";
import Project from "./Component/Static/Project";
import Task from "./Component/Static/TaskCategory";
import TimeSheet from "./Component/TimeSheet/TimesheetComponent";
import Profile from "./Component/ProfileComponent/EditProfileComponent";
import LeaveBalance from "./Component/Leave/leaveBalanceComponent";
import RegistrationApproval from "./Component/Approval/RegistrationApproval";
import TimesheetReport from "./Component/TimeSheet/TimesheetReport";
import MenuMaster from "./Component/Static/MenuMaster";
import UserRole from "./Component/Static/UserRole";
import HolidayList from "./Component/Registration/HolidayListComponent";
import Holiday from "./Component/Static/Holiday";
import RolePermission from "./Component/Static/RolePermission";
import MenuRole from "./Component/Static/MenuRole";
import TaxMaster from "./Component/Static/TaxMaster";
import TemplateComponent from "./Component/PaySlip/Template/TemplateComponent";
import TaskType from "./Component/Static/TaskType";
import SalaryComponent from "./Component/PaySlip/SalaryComponent/SalaryComponent";
import PayslipTemplate from "./Component/PaySlip/PayslipTemplate/PayslipTemplate";
import Registration from "./Component/RegistrationComponent";
import SalaryPackage from "./Component/PaySlip/Package/SalaryPackage";
import Error from "./Component/Errorlog/ErrorComponent";
import Errorlog from "./Component/Errorlog/ErrorlogComponent";
import StaticPage from "./Component/Static/StaticPage";
import StaticComponents from "./Component/Static/StaticComponents";
import ComponentDetails from "./Component/Static/ComponentDetails";
import Officelocation from "./Component/Static/OfficelocationComponent";
import Company from "./Component/Company/CompanyProfile";
import Team from "./Component/TimeSheet/Team";
import ARTypeMaster from "./Component/Static/ARTypeMaster";
import SalaryARInvoice from "./Component/PaySlip/SalaryComponent/EmployeeSalaryARInvoice";
import AttendanceReport from "./Component/Attendance/AttendanceReport";
import BankDetails from "./Component/Static/BankDetails";
import EmployeeIdCard from "./Component/EmployeeIdCard/EmployeeIdCardComponent";
import ProjectRoleMaster from "./Component/Static/StaticProjectRoleComponent"
import CompanyRegistration from "./Component/Company/CompanyRegistration";
import {Loader} from "./Services/Loader";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path="Auth" element={<Auth />}>
            <Route path="" element={<LogIn />} />
            <Route path="Register" element={<Registration />} />
            <Route path="HolidayList" element={<HolidayList />} />
            <Route path="CompanyRegistration" element={<CompanyRegistration />} />
          </Route>
          <Route path="" element={<App />}>
            <Route path="Payslip" element={<PaySlipComponent />} />
            <Route path="Dashboard1" element={<DashboardComponent />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="Performance" element={<PerformanceComponent />} />
            <Route path="AllApplyleavelist" element={<AllApplyleavelist />} />
            <Route path="applyleave" element={<ApplyLeave />} />
            <Route path="JobFunction" element={<JobFunction />} />
            <Route path="Document" element={<Document />} />
            <Route path="KeyRating" element={<KeyRating />} />
            <Route path="LeaveType" element={<LeaveType />} />
            <Route path="Permission" element={<Permission />} />
            <Route path="Roles" element={<Roles />} />
            <Route path="Status" element={<Status />} />
            <Route path="Task" element={<Task />} />
            <Route path="Project" element={<Project />} />
            <Route path="LeaveBalance" element={<LeaveBalance />} />
            <Route path="MenuMaster" element={<MenuMaster />} />
            <Route path="UserRole" element={<UserRole />} />
            <Route path="Holiday" element={<Holiday />} />
            <Route path="RolePermission" element={<RolePermission />} />
            <Route path="MenuRole" element={<MenuRole />} />
            <Route path="TaxMaster" element={<TaxMaster />} />
            <Route path="Template" element={<TemplateComponent />} />
            <Route path="PayslipTemplate" element={<PayslipTemplate />} />
            <Route path="TaskType" element={<TaskType />} />
            <Route path="SalaryComponent" element={<SalaryComponent />} />
            
            <Route path="Errorlog" element={<Errorlog />} />
            <Route path="StaticPage" element={<StaticPage />} />
            <Route path="StaticComponents" element={<StaticComponents />} />
            <Route path="Officelocation" element={<Officelocation />} />
            <Route path="ComponentDetails" element={<ComponentDetails />} />
            <Route path="Company" element={<Company />} />
            <Route path="AttendanceReport" element={<AttendanceReport />} />
            <Route path="ARTypeMaster" element={<ARTypeMaster />} />
            <Route path="SalaryARInvoice" element={<SalaryARInvoice />} />
            <Route path="BankDetails" element={<BankDetails />} />
            <Route path="EmployeeIdCard" element={<EmployeeIdCard />} />
            <Route path="ProjectRoleMaster" element={<ProjectRoleMaster />} />
            <Route
              path="RegistrationApproval"
              element={<RegistrationApproval />}
            />
            <Route path="TimeSheet" element={<Outlet />}>
              <Route path="Entry" element={<TimeSheet />} />
              <Route path="Report" element={<TimesheetReport />} />
              <Route path="Team" element={<Team />} />
            </Route>
            <Route path="SalaryPackage" element={<SalaryPackage />} />
            <Route path="Common" element={<Outlet />}>
              <Route path="Error" element={<Error />} />
              <Route path="ChangePassword" element={<ChangePasswordComponent />} />
              <Route path="Profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
        <Loader />
      </Provider>
    </BrowserRouter>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
