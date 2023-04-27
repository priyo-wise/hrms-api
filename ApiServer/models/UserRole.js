const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const fetch = async () => {
  const rows = await db.query(
    `SELECT t1.*,t2.FullName,t3.RoleName from UserRoles t1 join Employees t2 on t1.EmployeeId=t2.EmployeeId join StaticRoles t3 on t1.RoleId=t3.RoleId`
  );
  return helper.emptyOrRows(rows);
};

const fetchById = async (id) => {
  const rows = await db.query(`SELECT * FROM userRoles where RoleId = ${id}`);
  return helper.emptyOrRows(rows);
};

module.exports = {
  fetch,
  fetchById,
};
