const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const _ = require("underscore");
const utility = require("./Utility")
//const { query } = require("express");

const create = async (performance) => {
  if ((performance.PerformanceId || 0) == 0) {
    performance.PerformanceId = await utility.create(
      _.omit(performance, "details"),
      "employeePerformance"
    );
  } else {
    await utility.update(
      _.omit(performance, ["details"]),
      "employeePerformance",
      { PerformanceId: performance.PerformanceId }
    );
  }
  const details = _.map(performance.details, (m) => {
    m.PerformanceId = performance.PerformanceId;
    return _.omit(m, ["KRAShortDescription", "KRADescription"]);
  });
  _.each(details, (e) => {
    insertUpdatePerformanceDetail(e);
  });
};
const insertUpdatePerformanceDetail = async (item) => {
  if ((item.PerformanceDetailsId || 0) === 0) {
    await utility.create(
      _.omit(item, "PerformanceDetailsId"),
      "employeeperformancedetails"
    );
  } else {
    await utility.update(item, "employeeperformancedetails", {
      PerformanceDetailsId: item.PerformanceDetailsId,
    });
  }
};

const fetch = async () => {
  const rows = await db.query(
    `SELECT t1.*, t2.FullName FROM employeePerformance t1 join employees t2 on t1.EmployeeId=t2.EmployeeId`
  );
  return helper.emptyOrRows(rows);
};
const fetchByUser = async (employeeId) => {
  const rows = await db.query(
    `SELECT t1.*, t2.FullName FROM employeePerformance t1 join employees t2 on t1.EmployeeId=t2.EmployeeId where t1.EmployeeId = ${employeeId}`
  );
  return helper.emptyOrRows(rows);
};
const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM employeePerformance where PerformanceId = ${id}`
  );
  return helper.emptyOrRows(rows);
};

const fetchDetails = async (performanceId) => {
  const rows = await db.query(
    `SELECT t2.PerformanceDetailsId, t1.KRAId StandardKRAId, t2.EmpSpecificKRAId, t1.KRAShortDescription, t1.KRADescription, t2.EmployeeSelfAssessment, t2.ManagerAssessment FROM statickra t1 LEFT join employeeperformancedetails t2 on t1.KRAId=t2.StandardKRAId and t2.PerformanceId='${performanceId}' UNION ALL SELECT t2.PerformanceDetailsId, t2.StandardKRAId, t1.EmpSpecificKRAId, t1.KRA KRAShortDescription, t1.KRADescription, t2.EmployeeSelfAssessment, t2.ManagerAssessment FROM otheremployeesspecifickra t1 LEFT join employeeperformancedetails t2 on t1.EmpSpecificKRAId=t2.EmpSpecificKRAId and t2.PerformanceId='${performanceId}'`
  );
  return helper.emptyOrRows(rows);
};

module.exports = {
  create,
  fetch,
  fetchByUser,
  fetchById,
  fetchDetails,
};
