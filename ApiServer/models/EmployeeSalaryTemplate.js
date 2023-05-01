const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const create = async (salary) => {
  var query = "";
  if ((salary.SalaryTemplateId || 0) == 0) {
    query = `insert into EmployeeSalaryTemplate(SalaryTemplateId,FromDate,ToDate,EmployeeId,StatusId)
  values('${salary.SalaryTemplateId}','${salary.FromDate}','${salary.ToDate}',
  '${salary.EmployeeId}','${salary.StatusId}')`;
  } else {
    query = "update EmployeeSalaryTemplate set";
    query += ` FromDate='${salary.FromDate}'`;
    query += `, ToDate='${salary.ToDate}'`;
    query += `, EmployeeId='${salary.EmployeeId}'`;
    query += `, StatusId='${salary.StatusId}'`;
    query += ` where SalaryTemplateId='${salary.SalaryTemplateId}'`;
  }

  return await db.query(query);
};

const fetch = async () => {
  const rows = await db.query(
    `SELECT est.*,emp.FullName ,ss.Status from EmployeeSalaryTemplate est join Employees emp on emp.EmployeeId=est.EmployeeId join StaticStatus ss on ss.StatusId=est.StatusId `
  );
  console.log(rows);
  return helper.emptyOrRows(rows);
};

const fetchById = async (id) => {
  const rows = await db.query(
    `select * from EmployeeSalaryTemplate where SalaryTemplateId=${id}`
  );
  return helper.emptyOrRows(rows);
};

module.exports = {
  create,
  fetchById,
  fetch,
};
