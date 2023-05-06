const db = require("./db");
const helper = require("../helper");
const config = require("../config");

async function getleaveType(leaveId) {
  const rows = await db.query(
    `SELECT * FROM staticleavetypes where LeaveId=${leaveId}`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
}
const fetch = async (id) => {
  var query = await db.query(`SELECT * from staticleavetypes`);
  //var query = "";
  if (id == undefined) {
    query = await db.query(`SELECT * from staticleavetypes`);
  } else {
    query = await db.query(
      `SELECT staticleavetypes.LeaveId, staticleavetypes.LeaveName FROM staticleavetypes INNER JOIN employeeleavetransactions on staticleavetypes.LeaveId=employeeleavetransactions.LeaveTypeId WHERE employeeleavetransactions.EmployeeId=${id} GROUP by staticleavetypes.LeaveId;`
    );
    if (query.length == 0) {
      query = await db.query(`SELECT * from staticleavetypes where LeaveId=8`);
    }
  }
  return helper.emptyOrRows(query);
};

const fetchLeave = async (id) => {
  var query = await db.query(`SELECT * from staticleavetypes`);

  return helper.emptyOrRows(query);
};

const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM staticleavetypes where LeaveId = ${id}`
  );
  return helper.emptyOrRows(rows);
};

module.exports = {
  fetch,
  fetchById,
  getleaveType,
  fetchLeave,
};
