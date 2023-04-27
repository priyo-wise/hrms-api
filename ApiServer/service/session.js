const { fetch } = require("../models/Utility");

const setSession = (req, key, value) => {
  req.session[key] = value;
};
const getSession = (req, key) => {
  return req.session[key];
};
const setLoggedUser = (req, employeeId) => {
  setSession(req, "EmployeeId", employeeId);
};
const getLoggedUser = (req) => {
  return getSession(req, "EmployeeId");
};
const getLoggedCompanyId =async (req)=>{
  return await fetch("employees",{EmployeeId:getLoggedUser(req)},true).then(c=>c?.CompanyId??0).catch(err=>{throw err;});
}
const clear = (req) => {
  req.session.destroy();
};

module.exports = {
  setLoggedUser,
  getLoggedUser,
  clear,
  getLoggedCompanyId,
};
