const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const create = async (salary) => {
  var query = "";
  if ((salary.EmployeePackageId || 0) == 0) {
    query = `insert into EmployeePackageDetails(EmployeePackageId,SalaryComponentId,Amount)
  values('${salary.EmployeePackageId}','${salary.SalaryComponentId}','${salary.Amount}')`;
  } else {
    query = "update EmployeePackageDetails set";
    query += ` SalaryComponentId='${salary.SalaryComponentId}'`;
    query += `, Amount='${salary.Amount}'`;
    query += ` where EmployeePackageId='${salary.EmployeePackageId}'`;
  }

  return await db.query(query);
};

const fetch = async () => {
  const rows = await db.query(
    `SELECT epd.*,ssc.EarningOrDeductionName from EmployeePackageDetails epd join StaticSalaryComponents ssc on ssc.SalaryComponentsId=epd.SalaryComponentId `
  );
  console.log(rows);
  return helper.emptyOrRows(rows);
};

const fetchById = async (id) => {
  const rows = await db.query(
    `select * from EmployeePackageDetails where EmployeePackageId=${id}`
  );
  return helper.emptyOrRows(rows);
};

module.exports = {
  create,
  fetchById,
  fetch,
};
