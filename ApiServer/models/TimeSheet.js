const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const create = async (TimeSheet) => {
  if ((TimeSheet.TimeSheetId || 0) == 0) {
    query = `Insert Into timesheet (EmployeeId, Date, TimeInHour, ProjectId, TaskCategoryId, Details)
     values ('${TimeSheet.EmployeeId}', '${TimeSheet.Date}', '${TimeSheet.TimeInHour}', '${TimeSheet.ProjectId}',
     '${TimeSheet.TaskCategoryId}', '${TimeSheet.Details}')`;
  } else {
    query = "update timesheet set";
    query += ` EmployeeId='${TimeSheet.EmployeeId}'`;
    query += `, Date='${TimeSheet.Date}'`;
    query += `, TimeInHour='${TimeSheet.TimeInHour}'`;
    query += `, ProjectId='${TimeSheet.ProjectId}'`;
    query += `, TaskCategoryId='${TimeSheet.TaskCategoryId}'`;
    query += `, Details='${TimeSheet.Details}'`;
    query += ` where TimeSheetId='${TimeSheet.TimeSheetId}'`;
  }
  await db.query(query);
};

const fetch = async () => {
  const rows = await db.query(
    `SELECT t1.*,t2.TaskCategoryName,t3.ProjectName from timesheet t1 join taskcategorymaster t2 on t1.TaskCategoryId=t2.TaskCategoryId join projectmaster t3 on t1.ProjectId=t3.ProjectId`
  );
  return helper.emptyOrRows(rows);
};
const fetchByUser = async (employeeId) => {
  const rows = await db.query(
    `SELECT t1.*, t2.FullName FROM timesheet t1 join employees t2 on t1.EmployeeId=t2.EmployeeId where t1.EmployeeId = ${employeeId}`
  );
  return helper.emptyOrRows(rows);
};
const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM timesheet where TimeSheetId = ${id}`
  );
  return helper.emptyOrRows(rows);
};

const fetch1 = async () => {
  const rows = await db.query(`select *
  from employeePerformanceDetails t1
  RIGHT join statickra t2 on t1.StandardKRAId=t2.KRAId`);
  return helper.emptyOrRows(rows);
};

module.exports = {
  create,
  fetch,
  fetchByUser,
  fetchById,
  fetch1,
};
