const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const create = async (performance) => {
  var query = "";
  if ((performance.PerformanceId || 0) == 0) {
    query = `Insert Into performance (UserId, FromDate, ToDate, KeyRatingAria, EmployeeDescription, ManagerDescription, EmployeeRating, ManagerRating, FinalRating)
   values ('${performance.UserId}', '${performance.FromDate}', '${performance.ToDate}', '${performance.KeyRatingAria}',
   '${performance.EmployeeDescription}', '${performance.ManagerDescription}', '${performance.EmployeeRating}', '${performance.ManagerRating}', '${performance.FinalRating}')`;
  } else {
    query = "update performance set";
    query += ` UserId='${performance.UserId}'`;
    query += `, FromDate='${performance.FromDate}'`;
    query += `, ToDate='${performance.ToDate}'`;
    query += `, KeyRatingAria='${performance.KeyRatingAria}'`;
    query += `, EmployeeDescription='${performance.EmployeeDescription}'`;
    query += `, ManagerDescription='${performance.ManagerDescription}'`;
    query += `, EmployeeRating='${performance.EmployeeRating}'`;
    query += `, ManagerRating='${performance.ManagerRating}'`;
    query += `, FinalRating='${performance.FinalRating}'`;
    query += ` where PerformanceId='${performance.PerformanceId}'`;
  }
  await db.query(query);
};

const fetch = async () => {
  const rows = await db.query(
    `SELECT t1.*, t2.FullName, t2.EmployeeCode FROM performance t1 join users t2 on t1.UserId=t2.UserID`
  );
  return helper.emptyOrRows(rows);
};
const fetchByUser = async (userId) => {
  const rows = await db.query(
    `SELECT t1.*, t2.FullName, t2.EmployeeCode FROM performance t1 join users t2 on t1.UserId=t2.UserID where t1.UserId = ${userId}`
  );
  return helper.emptyOrRows(rows);
};
const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM performance where PerformanceId = ${id}`
  );
  return helper.emptyOrRows(rows);
};

module.exports = {
  create,
  fetch,
  fetchByUser,
  fetchById,
};
