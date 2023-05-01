import { createSlice } from "@reduxjs/toolkit";
import _ from "underscore";

const performancePermission = [
  {
    SystemCode: "Performance - Add",
    DBCode: "PA",
  },
  {
    SystemCode: "Performance - Edit",
    DBCode: "PE",
  },
  {
    SystemCode: "Performance - Modify Date",
    DBCode: "PMD",
  },
  {
    SystemCode: "Performance - Select User",
    DBCode: "PSU",
  },
  {
    SystemCode: "Performance - Employee Rating",
    DBCode: "PER",
  },
  {
    SystemCode: "Performance - Manager Rating",
    DBCode: "PMR",
  },
  {
    SystemCode: "Performance - Final Rating",
    DBCode: "PFR",
  },
  {
    SystemCode: "Performance - Final Review Comment",
    DBCode: "PFRC",
  },
  {
    SystemCode: "Performance - HR Comment",
    DBCode: "PHRC",
  },
  {
    SystemCode: "Performance - Employee Self Assessment",
    DBCode: "PESA",
  },
  {
    SystemCode: "Performance - Manager Assessment",
    DBCode: "PMA",
  },
];

const leavePermission = [
  {
    SystemCode: "Leave - Add",
    DBCode: "LA",
  },
  {
    SystemCode: "Leave - Edit",
    DBCode: "LE",
  },
  {
    SystemCode: "Leave - Cancel",
    DBCode: "LC",
  },
  {
    SystemCode: "Leave - Approve Reject",
    DBCode: "LAR",
  },
  {
    SystemCode: "Leave - Search All User",
    DBCode: "LSAU",
  },
  {
    SystemCode: "Leave - Allocation",
    DBCode: "LAC",
  },
];

const masterMappingPermission = [
  { SystemCode: "Roles - Add", DBCode: "RA" },
  { SystemCode: "Roles - Edit", DBCode: "RE" },
  { SystemCode: "Roles - Delete", DBCode: "RD" },
  { SystemCode: "Permission - Add", DBCode: "UPA" },
  { SystemCode: "Permission - Edit", DBCode: "UPE" },
  { SystemCode: "Permission - Delete", DBCode: "UPD" },
  { SystemCode: "Menu - Add", DBCode: "MA" },
  { SystemCode: "Menu - Edit", DBCode: "ME" },
  { SystemCode: "Menu - Delete", DBCode: "MD" },
  { SystemCode: "Status - Add", DBCode: "SA" },
  { SystemCode: "Status - Edit", DBCode: "SE" },
  { SystemCode: "Status - Delete", DBCode: "SD" },
  { SystemCode: "Tax - Add", DBCode: "TA" },
  { SystemCode: "Tax - Edit", DBCode: "TE" },
  { SystemCode: "Tax - Delete", DBCode: "TD" },
  { SystemCode: "Key Rating - Add", DBCode: "KRA" },
  { SystemCode: "Key Rating - Edit", DBCode: "KRE" },
  { SystemCode: "Key Rating - Delete", DBCode: "KRD" },
  { SystemCode: "Leave Type - Add", DBCode: "LTA" },
  { SystemCode: "Leave Type - Edit", DBCode: "LTE" },
  { SystemCode: "Leave Type - Delete", DBCode: "LTD" },
  { SystemCode: "Job Function - Add", DBCode: "JFA" },
  { SystemCode: "Job Function - Edit", DBCode: "JFE" },
  { SystemCode: "Job Function - Delete", DBCode: "JFD" },
  { SystemCode: "Document - Add", DBCode: "DA" },
  { SystemCode: "Document - Edit", DBCode: "DE" },
  { SystemCode: "Document - Delete", DBCode: "DD" },
  { SystemCode: "User Role - Add", DBCode: "URA" },
  { SystemCode: "User Role - Delete", DBCode: "URD" },
  { SystemCode: "Menu Role - Add", DBCode: "MRA" },
  { SystemCode: "Menu Role - Delete", DBCode: "MRD" },
  { SystemCode: "Role Permission - Add", DBCode: "RPA" },
  { SystemCode: "Role Permission - Delete", DBCode: "RPD" },
  { SystemCode: "Registration - Approval", DBCode: "RAP" },
];
const timeSheetReportPermission = [
  { SystemCode: "TimeSheet Report - Search All Users", DBCode: "SAU" },
  { SystemCode: "TimeSheet Report - Reporting User", DBCode: "TSRRU" },
];
const payslipPermission = [
  { SystemCode: "PaySlip - Add", DBCode: "PSA" },
  { SystemCode: "PaySlip - Delete", DBCode: "PSD" },
  { SystemCode: "PaySlip - Edit", DBCode: "PSE" },
  { SystemCode: "PaySlip - Publish", DBCode: "PSP" },
  { SystemCode: "PaySlip - Search AllUser", DBCode: "PSSAU" },
  { SystemCode: "PaySlip - Add Payment", DBCode: "PSAP" },
  { SystemCode: "PaySlip - Delete Payment", DBCode: "PSDP" },
];
const projectPermission = [
  { SystemCode: "Project - Add", DBCode: "PRA" },
  { SystemCode: "Project - Edit", DBCode: "PRE" },
  { SystemCode: "Project - Delete", DBCode: "PRD" },
  { SystemCode: "Project - AssignTeam", DBCode: "PEAT" },
];
const projectRolePermission = [
  { SystemCode: "Project Role - Add", DBCode: "PROLEA" },
  { SystemCode: "Project Role - Edit", DBCode: "PROLEE" },
  { SystemCode: "Project Role - Delete", DBCode: "PROLED" },
];
const holidayPermission = [
  { SystemCode: "Holiday - Add", DBCode: "HA" },
  { SystemCode: "Holiday - Edit", DBCode: "HE" },
  { SystemCode: "Holiday - Delete", DBCode: "HD" },
];
const salaryTemplatePermission = [
  { SystemCode: "Salary Template - Add", DBCode: "STA" },
  { SystemCode: "Salary Template - Edit", DBCode: "STE" },
];
const salaryComponentPermission = [
  { SystemCode: "Salary - Component Add", DBCode: "SCA" },
  { SystemCode: "Salary - Component Edit", DBCode: "SCE" },
];
const salaryPackagePermission = [
  { SystemCode: "Salary Package - Add", DBCode: "SPA" },
  { SystemCode: "Salary Package - Edit", DBCode: "SPE" },
  { SystemCode: "Salary Package - Search AllUser", DBCode: "SPSAU" },
];
const UserProfilePermission = [
  { SystemCode: "User Profile - Add", DBCode: "UPFA" },
  { SystemCode: "User Profile - Edit", DBCode: "UPFE" },
  { SystemCode: "User Profile - View", DBCode: "UPFV" },
];

const officelocationPermission = [
  { SystemCode: "Office Location - Add", DBCode: "OLA" },
  { SystemCode: "Office Location - Edit", DBCode: "OLE" },
  { SystemCode: "Office Location - Delete", DBCode: "OLD" },
];

const EmployeeDocumentPermission = [
  { SystemCode: "EmployeeDocument - Reject", DBCode: "EDRE" },
  { SystemCode: "EmployeeDocument - Approve", DBCode: "EDAPP" },
  { SystemCode: "EmployeeDocument - View", DBCode: "EDVI" },
];
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    loged: true,
    PermissionList: [],
    MenuList: [{ MenuId: 0, MenuText: "Dashboard", Route: "", ParentId: null }],
    PermissionCodeList: timeSheetReportPermission
      .concat(performancePermission)
      .concat(projectPermission)
      .concat(leavePermission)
      .concat(payslipPermission)
      .concat(holidayPermission)
      .concat(salaryTemplatePermission)
      .concat(salaryComponentPermission)
      .concat(salaryPackagePermission)
      .concat(UserProfilePermission)
      .concat(officelocationPermission)
      .concat(EmployeeDocumentPermission)
      .concat(masterMappingPermission),
    CompanyInfo: {},
  },
  reducers: {
    logout: (state) => {
      state.loged = false;
    },
    login: (state) => {
      state.loged = true;
    },
    setPermission: (state, { payload }) => {
      state.PermissionList = payload;
    },
    setMenu: (state, { payload }) => {
      state.MenuList = _.where(state.MenuList, { MenuId: 0 }).concat(payload);
    },
    setCompanyInfo: (state, { payload }) => {
      state.CompanyInfo = payload;
    },
  },
});
export const { logout, login, setPermission, setMenu, setCompanyInfo } = authSlice.actions;
export default authSlice.reducer;
