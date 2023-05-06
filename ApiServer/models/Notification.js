const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const fetch = async (Employee) => {
  const rows = await db.query(
    `select RoleId from userroles where EmployeeId= ${Employee}`
  );

  var roles = rows[0].RoleId;
  const data = await db.query(
    `select * from employeeactionnotification where Status = 5`
  );

  return helper.emptyOrRows(data);
};

module.exports = {
  fetch,
};
