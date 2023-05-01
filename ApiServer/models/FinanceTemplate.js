const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const encryption = require("../service/encryption");

const fetch = async () => {
  const rows = await db.query(
    `SELECT ef.*,emp.FullName ,ss.Status from EmployeeFinance ef join Employees emp on emp.EmployeeId=ef.EmployeeId join StaticStatus ss on ss.StatusId=ef.StatusId `
  );
  return helper.emptyOrRows(rows);
};

const fetchById = async (id) => {
  const rows = await db.query(
    `select * from EmployeeFinance where FinanceId=${id}`
  );
  return helper.emptyOrRows(rows);
};

module.exports = {
  fetchById,
  fetch,
};
