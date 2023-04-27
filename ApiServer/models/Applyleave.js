const db = require("./db");
const helper = require("../helper");
const config = require("../config");

async function create(leave) {
  const result = await db.query(
    `INSERT INTO userleaves (UserId	,FromDate,ToDate,EmergencyPhone,LeaveType,Reason,Approved,ApproveDate,DenyReason,ApprovedByUserId) VALUES (1,'${leave.FromDate}','${leave.ToDate}','','${leave.LeaveType}','${leave.Reason}',0,'','',1)`
  );
  let message = "Error in creating Leave";
  if (result.affectedRows) {
    message = "Leave Added successfully";
  }

  return { message };
}

const Fetch = async () => {
  const rows = await db.query(
    `SELECT t1.LeaveType, t1.FromDate,t1.ToDate,t2.FullName FROM userleaves t1 join users t2 on t1.UserID=t2.UserID`
  );
  return helper.emptyOrRows(rows);
};

module.exports = {
  create,
  Fetch,
};
