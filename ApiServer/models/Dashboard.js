const db = require("./db");
const helper = require("../helper");
const config = require("../config");

async function getMultiple() {
  const rows = await db.query(
    `SELECT * FROM employees join staticstatus on staticstatus.StatusId= employees.StatusId`
  );
  const data = helper.emptyOrRows(rows);

  return {
    data,
  };
}

const getTimeSheetOverView = async (userId) => {
  const lastDay = await db.query(
    `select MAX(Date) LastDate from timesheet WHERE EmployeeId=${userId}`
  );
  const lastEntry = await db.query(
    `select t1.*, t3.ProjectName from timesheet t1 join ( select MAX(UpdatedTime) UpdatedTime, EmployeeId from timesheet GROUP BY EmployeeId) t2 on t1.UpdatedTime=t2.UpdatedTime and t1.EmployeeId=t2.EmployeeId JOIN projectmaster t3 on t3.ProjectId=t1.ProjectId where t1.EmployeeId=${userId}`
  );
  return {
    lastDay,
    lastEntry,
  };
};

const fetchByEmpId = async (id) => {
  const rows = await db.query(
    `SELECT EmployeeId, ManagerScore, EmpSelfScore,FinalAgreedScore FROM employeePerformance where EmployeeId = ${id}`
  );
  const details = helper.emptyOrRows(rows);

  return {
    details,
  };
};
const fetchlastleaveStatus = async (id) => {
  const rows = await db.query(
    `SELECT t2.Status FROM employeeleaves t1 INNER JOIN staticstatus t2 on t1.ApprovalStatusId=t2.StatusId where t1.EmployeeId=${id} ORDER BY t1.LeavesId DESC LIMIT 1;`
  );

  return helper.emptyOrRows(rows);
};
const fetchEmpleave = async (id) => {
  const rows = await db.query(
    `SELECT staticleavetypes.LeaveName,SUM(leavetransactions.NoOfLeaveDebited)-SUM(leavetransactions.NoOfLeaveCredited) as Balance, SUM(leavetransactions.NoOfLeaveCredited) as Usedleave FROM employeeleavetransactions leavetransactions INNER JOIN staticleavetypes on leavetransactions.leavetypeId=staticleavetypes.LeaveId  where leavetransactions.EmployeeId=${id} GROUP BY leavetransactions.EmployeeId,leavetransactions.leavetypeId ;`
  );
  return helper.emptyOrRows(rows);
};

//CheckIn Status = 1
//CheckOut Status = 2
const submit = async (id) => {
  var msg = "";
  const query = await db.query(
    `select * from EmployeeAttendance where EmployeeId=${id}  && CheckInDate = CURRENT_DATE`
  );
  var checked = query?.slice(-1)[0] ?? [];
  if (query.length == 0 || (query.length > 0 && checked.CheckOutTime != null)) {
    const rows = await db.query(
      `Insert into EmployeeAttendance(CheckInDate,CheckInTime,EmployeeId,Status) values(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,${id},1)`
    );
    msg = {
      Message: "Success",
    };
    return msg;
  } else {
    const rows = await db.query(
      `update EmployeeAttendance set CheckOutTime = CURRENT_TIMESTAMP ,Status=2 where EmployeeId=${id} && AttendanceId =${checked.AttendanceId}`
    );
    return helper.emptyOrRows(rows);
  }
};

const fetchCheckIn = async (id) => {
  const rows = await db.query(
    `select * from EmployeeAttendance where EmployeeId = ${id} && CheckInDate = CURRENT_DATE`
  );
  return rows;
};
const fetchTopPerformers = async (id) => {
  const rows = await db.query(
    `select  employeeperformance.ManagerScore, employeeperformance.EmpSelfScore,employeeperformance.FinalAgreedScore as value,
    employees.EmployeeId, UPPER(employees.FullName) as argument, employees.Designation, UPPER(employees.EmployeeCode) as EmployeeCode
    from employeeperformance join employees on employees.EmployeeId=employeeperformance.EmployeeId limit 4`
  );
  return rows;
};

const fetchEmpProject = async (id) => {
  const rows = await db.query(
    `select t2.ProjectId, t1.ProjectName,t2.CreatedDate from projectmaster t1 INNER JOIN project_team t2 on t1.ProjectId =t2.ProjectId JOIN employees t3 on t2.EmployeeId=t3.EmployeeId WHERE t2.EmployeeId=${id} GROUP by t2.ProjectId;`
  );
  return helper.emptyOrRows(rows);
};

const fetchProjectManager = async (id) => {
  const rows = await db.query(
    `SELECT projectteam.ProjectId,emp.FullName from UserRoles  join Employees emp on UserRoles.EmployeeId=emp.EmployeeId JOIN project_team projectteam on UserRoles.EmployeeId=projectteam.EmployeeId join StaticRoles role on UserRoles.RoleId=role.RoleId WHERE UserRoles.RoleId=2  GROUP by role.RoleId,projectteam.EmployeeId; `
  );
  return helper.emptyOrRows(rows);
};

module.exports = {
  getMultiple,
  fetchByEmpId,
  fetchlastleaveStatus,
  fetchEmpleave,
  getTimeSheetOverView,
  submit,
  fetchCheckIn,
  fetchEmpProject,
  fetchProjectManager,
  fetchTopPerformers,
};
