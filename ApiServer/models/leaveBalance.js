const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const currentdate=new Date();
const create = async (leaveBalance) => {
  const rows = await db.query(`SELECT *  FROM employeeleavetransactions  where EmployeeId = ${leaveBalance.EmployeeId} and LeaveTypeId ='${leaveBalance.LeaveTypeId}'`);
  
  var query = "";
  var msg="";
  if ((leaveBalance.leaveTransactionsId || 0) == 0) {
      if(rows.length>0){
        msg="This type of leave Already Allocated" 

      }else{        
     query = `Insert Into employeeleavetransactions (EmployeeId,leavetypeId, ValidFormDate,ValidToDate,TransactionDate,NoOfLeaveCredited,NoOfLeaveDebited,Notes,TransactionByUserId,TransactionsType)
     values ('${leaveBalance.EmployeeId}','${leaveBalance.leavetypeId}','${leaveBalance.ValidFormDate}','${leaveBalance.ValidToDate}','${currentdate.toISOString()}','${leaveBalance.NoOfLeaveCredited}','${leaveBalance.NoOfLeaveDebited}','${leaveBalance.Notes}','${leaveBalance.TransactionByUserId}','${leaveBalance.TransactionsType}')`;
     var addempleaveBlance=`Insert Into employeeleavebalances (EmployeeId,LeaveTypeId, Balance)
      values ('${leaveBalance.EmployeeId}','${leaveBalance.leavetypeId}','0')`;
      await db.query(addempleaveBlance);
     
     msg="Successfully Leave Allocated" 
  
    }
    
  } else {
    query = "update employeeleavetransactions set";
    query += ` EmployeeId='${leaveBalance.EmployeeId}'`;
    query += `, ValidFormDate='${leaveBalance.ValidFormDate}'`;
    query += `, leavetypeId='${leaveBalance.leavetypeId}'`;    
    query += `, ValidToDate='${leaveBalance.ValidToDate}'`;
    query += `, NoOfLeaveDebited='${leaveBalance.NoOfLeaveDebited}'`;
    query += `, NoOfLeaveCredited='${leaveBalance.NoOfLeaveCredited}'`;
    query += `, Notes='${leaveBalance.Notes}'`;
    query += `, TransactionsType='${leaveBalance.TransactionsType}'`;
    query += `, TransactionByUserId='${leaveBalance.TransactionByUserId}'`;
    query += `, TransactionDate='${currentdate.toISOString()}'`;
    query += ` where leaveTransactionsId='${leaveBalance.leaveTransactionsId}'`;
    msg="Leave Updated Successfully";
    
  }
  if(query!=""){
    await db.query(query);
  }
  return msg;
};

const fetch = async () => {
  const rows = await db.query(`SELECT e1.leaveTransactionsId, e1.NoOfLeaveDebited,e2.FullName as employeeName,e3.LeaveName from employeeleavetransactions e1 join employees e2 on e1.EmployeeId=e2.EmployeeId join staticleavetypes e3 on e1.LeaveTypeId=e3.LeaveId where e1.NoOfLeaveDebited>0 ;`);
  return helper.emptyOrRows(rows);
};


const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM employeeleavetransactions  where leaveTransactionsId = ${id}`
  );
  
  return helper.emptyOrRows(rows);
};
const updateleavestatus = async (Leave) => {
  var query = "";
  if (Leave.LeavesId > 0) {
    query = "update employeeLeaves set";
    query += ` ApprovalStatusId='${Leave.ApprovalStatusId}'`;
    query += `, StatusId='${Leave.StatusId}'`;
    query += ` where LeavesId='${Leave.LeavesId}'`;
  }
  await db.query(query);
};
module.exports = {
  create,
  fetch,
  fetchById,
  updateleavestatus,
};
