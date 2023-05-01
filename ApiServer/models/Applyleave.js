const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const _ = require("underscore");
const currentdate=new Date();
const create = async (Leave) => {
  const countleave=await db.query(`SELECT SUM(leavetransactions.NoOfLeaveDebited)-SUM(leavetransactions.NoOfLeaveCredited) as Balance, SUM(leavetransactions.NoOfLeaveCredited) as Usedleave FROM employeeleavetransactions leavetransactions where leavetransactions.EmployeeId=${Leave.EmployeeId} AND leavetransactions.leavetypeId=${Leave.LeaveTypeId} GROUP BY leavetransactions.EmployeeId,leavetransactions.leavetypeId`);
  const Allocatedleave=await db.query(`SELECT SUM(empleavetransaction.NoOfLeaveDebited) as Allocatedleave,empleavetransaction.* FROM employeeleavetransactions empleavetransaction WHERE empleavetransaction.leavetypeId=${Leave.LeaveTypeId} AND empleavetransaction.EmployeeId=${Leave.EmployeeId}`);
  const leaveBalance=await db.query(`SELECT t1.Balance FROM employeeleavebalances t1 INNER JOIN employeeleaves t2 on t1.LeaveTypeId=t2.LeaveTypeId where t2.EmployeeId=${Leave.EmployeeId} AND t1.LeaveTypeId=${Leave.LeaveTypeId}`);
  const useleave=await db.query(`SELECT DATEDIFF(t2.LeaveToDate,t2.LeaveFromDate) as Usedleave FROM employeeleaves t2 where t2.EmployeeId=${Leave.EmployeeId} AND t2.LeaveTypeId=${Leave.LeaveTypeId}`);
  const Allocatedleave0=await db.query(`SELECT Balance as AllocatedleaveBalance FROM employeeleavebalances  where EmployeeId=${Leave.EmployeeId} AND LeaveTypeId=${Leave.LeaveTypeId}`);
  const currentleavecount=await db.query(`SELECT DATEDIFF('${Leave.LeaveToDate}','${Leave.LeaveFromDate}') as currentleavecount FROM employeeleaves where EmployeeId=${Leave.EmployeeId} AND LeaveTypeId=${Leave.LeaveTypeId}`);
  const rows = await db.query(`SELECT *  FROM employeeLeaves  where EmployeeId = ${Leave.EmployeeId} and LeaveFromDate ='${Leave.LeaveFromDate}'`);
  const Usedleave=useleave==""?0:useleave[0].Usedleave;
  const currentleave=currentleavecount==""?0:currentleavecount[0].currentleavecount;
  
  const getAllocatedleave=Allocatedleave==""?0:Allocatedleave[0].leaveTransactionsId;
  
  var query = "";
  var msg="";
  // if ((Leave.LeavesId || 0) == 0) {
  //   query = db.generateDynamicSqlInsertQuery(
  //     _.omit(Leave, ["LeavesId"]),
  //     "employeeLeaves"
  //   );
  // } else {
  //   query = db.generateDynamicSqlUpdateQuery(
  //     _.omit(Leave, ["LeavesId"]),
  //     "employeeLeaves"
  //   );
  //   query += ` where LeavesId='${Leave.LeavesId}'`;
  // }

  if(countleave.length==0||Leave.LeaveTypeId=='8'){
    if ((Leave.LeavesId || 0) == 0) {
      if(rows.length>0){
    
         msg="This type of leave Already Applied !"
      }else{
  
        query = `Insert Into employeeLeaves (EmployeeId,LeaveApplyDate,LeaveFromDate, LeaveToDate, LeaveTypeId, StatusId,Remarks,ApprovalStatusId)
        values ('${Leave.EmployeeId}','${currentdate.toISOString()}', '${Leave.LeaveFromDate}','${Leave.LeaveToDate}', '${Leave.LeaveTypeId}',
        1,'${Leave.Remarks}',5)`;
        msg="Leave Added Successfully";
        var addleaveTransaction=`Insert Into employeeleavetransactions (EmployeeId,LeaveTypeId, ValidFormDate,ValidToDate,TransactionDate,NoOfLeaveCredited,NoOfLeaveDebited,Notes,TransactionByUserId,TransactionsType)
        values ('${Leave.EmployeeId}','${Leave.LeaveTypeId}','${Allocatedleave[0].ValidFormDate}','${Allocatedleave[0].ValidToDate}','${Leave.LeaveFromDate}','${Leave.leavedays}','0','${Leave.Remarks}','${Leave.EmployeeId}','Cr')`;
       // var addempleaveBlance=`Insert Into employeeleavebalances (EmployeeId,LeaveTypeId, Balance)
       // values ('${Leave.EmployeeId}','${Leave.LeaveTypeId}','${(Allocatedleave[0].Allocatedleave)-(currentleave==0?1:currentleave)}')`;
  
        
       var addempleaveBlance = "update employeeleavebalances set";
        addempleaveBlance += ` Balance='0'`;
        addempleaveBlance += ` where LeaveTypeId='${Leave.LeaveTypeId}' and EmployeeId='${Leave.EmployeeId}' `;
  
        var AddUserContactNumber = "update employees set";
        AddUserContactNumber += ` EmergencyPhone='${Leave.Phone}' `;
        AddUserContactNumber += ` where EmployeeId='${Leave.EmployeeId}' `;
  
  
  
        await db.query(AddUserContactNumber);
        await db.query(addleaveTransaction);
        await db.query(addempleaveBlance);

      }
        
      
    } else {
      
      query = "update employeeLeaves set";
      query += ` EmployeeId='${Leave.EmployeeId}'`;
       query += `, LeaveApplyDate='${currentdate.toISOString()}'`;
      query += `, LeaveFromDate='${Leave.LeaveFromDate}'`;
      query += `, LeaveToDate='${Leave.LeaveToDate}'`;
      query += `, LeaveTypeId='${Leave.LeaveTypeId}'`;
      query += `, Remarks='${Leave.Remarks}'`;
      query += ` where LeavesId='${Leave.LeavesId}'`;
  
      
      var UpdateleaveTransaction = "update employeeleavetransactions set";
      UpdateleaveTransaction += ` NoOfLeaveCredited='${Leave.leavedays}'`;
      UpdateleaveTransaction += ` TransactionDate='${Leave.LeaveFromDate}'`;    
      UpdateleaveTransaction += ` where LeaveTypeId='${Leave.LeaveTypeId}' and EmployeeId='${Leave.EmployeeId}' `;
      
      var UpdateUserContactNumber = "update employees set";
      UpdateUserContactNumber += ` EmergencyPhone='${Leave.Phone}' `;
      UpdateUserContactNumber += ` where EmployeeId='${Leave.EmployeeId}' `;
  
      
      await db.query(UpdateUserContactNumber);
      await db.query(UpdateleaveTransaction);
  

      msg="Leave Updated Successfully";
      }
    
  }

  if(getAllocatedleave==0){
    msg="You have not been allotted this type of leave !";
  }else if(countleave[0].Balance==0||countleave[0].Balance < countleave[0].Usedleave){
    msg="All Allotted leaves Used , Please Apply UnPaid Or Other leaves !";
  }else if(countleave[0].Balance < Leave.leavedays){
    msg="You don't have sufficient balance for this leave !";
  }  
  else{   
  //if((Usedleave + currentleave)<= Number(totalleaveBalance)){
   if ((Leave.LeavesId || 0) == 0) {
    if(rows.length>0){
  
       msg="This type of leave Already Applied !"
    }else{

      query = `Insert Into employeeLeaves (EmployeeId,LeaveApplyDate,LeaveFromDate, LeaveToDate, LeaveTypeId, StatusId,Remarks,ApprovalStatusId)
      values ('${Leave.EmployeeId}','${currentdate.toISOString()}', '${Leave.LeaveFromDate}','${Leave.LeaveToDate}', '${Leave.LeaveTypeId}',
      1,'${Leave.Remarks}',5)`;
      msg="Leave Added Successfully";
      var addleaveTransaction=`Insert Into employeeleavetransactions (EmployeeId,LeaveTypeId, ValidFormDate,ValidToDate,TransactionDate,NoOfLeaveCredited,NoOfLeaveDebited,Notes,TransactionByUserId,TransactionsType)
      values ('${Leave.EmployeeId}','${Leave.LeaveTypeId}','${Allocatedleave[0].ValidFormDate}','${Allocatedleave[0].ValidToDate}','${Leave.LeaveFromDate}','${Leave.leavedays}','0','${Leave.Remarks}','${Leave.EmployeeId}','Cr')`;
     // var addempleaveBlance=`Insert Into employeeleavebalances (EmployeeId,LeaveTypeId, Balance)
     // values ('${Leave.EmployeeId}','${Leave.LeaveTypeId}','${(Allocatedleave[0].Allocatedleave)-(currentleave==0?1:currentleave)}')`;

      
     var addempleaveBlance = "update employeeleavebalances set";
      addempleaveBlance += ` Balance='${(Allocatedleave[0].Allocatedleave)-(currentleave==0?1:currentleave)}'`;
      addempleaveBlance += ` where LeaveTypeId='${Leave.LeaveTypeId}' and EmployeeId='${Leave.EmployeeId}' `;

      var AddUserContactNumber = "update employees set";
      AddUserContactNumber += ` EmergencyPhone='${Leave.Phone}' `;
      AddUserContactNumber += ` where EmployeeId='${Leave.EmployeeId}' `;



      await db.query(AddUserContactNumber);
      await db.query(addleaveTransaction);
      await db.query(addempleaveBlance);
      
    }
      
    
  } else {
    
    query = "update employeeLeaves set";
    query += ` EmployeeId='${Leave.EmployeeId}'`;
     query += `, LeaveApplyDate='${currentdate.toISOString()}'`;
    query += `, LeaveFromDate='${Leave.LeaveFromDate}'`;
    query += `, LeaveToDate='${Leave.LeaveToDate}'`;
    query += `, LeaveTypeId='${Leave.LeaveTypeId}'`;
    query += `, Remarks='${Leave.Remarks}'`;
    query += ` where LeavesId='${Leave.LeavesId}'`;

    
    var UpdateleaveTransaction = "update employeeleavetransactions set";
    UpdateleaveTransaction += ` NoOfLeaveCredited='${Leave.leavedays}'`;
    UpdateleaveTransaction += `, TransactionDate='${Leave.LeaveFromDate}'`;    
    UpdateleaveTransaction += ` where LeaveTypeId='${Leave.LeaveTypeId}' and EmployeeId='${Leave.EmployeeId}' `;
    
    var UpdateUserContactNumber = "update employees set";
    UpdateUserContactNumber += ` EmergencyPhone='${Leave.Phone}' `;
    UpdateUserContactNumber += ` where EmployeeId='${Leave.EmployeeId}' `;

    
    await db.query(UpdateUserContactNumber);
    await db.query(UpdateleaveTransaction);


    msg="Leave Updated Successfully";
    }
  
   // }else{
    //msg="Please Select UnPaid leave";
    //}
  }
  if(query!=""){
    await db.query(query);
  }
  return msg;
};

const fetch = async () => {
  const rows = await db.query(`SELECT employees.FullName, e1.*,e2.LeaveName,e3.Status,e4.status as approvalStatus from employeeLeaves e1 join staticleavetypes e2 on e1.LeaveTypeId=e2.LeaveId join staticstatus e3 on e1.StatusId=e3.StatusId join staticstatus e4 on e1.ApprovalStatusId=e4.StatusId join employees on e1.EmployeeId=employees.EmployeeId`);
  //console.log(rows);
  return helper.emptyOrRows(rows);
};
const fetchleaveByEmployee = async (id) => {
  const rows = await db.query(`SELECT employees.FullName, e1.*,e2.LeaveName,e3.Status,e4.status as approvalStatus from employeeLeaves e1 join staticleavetypes e2 on e1.LeaveTypeId=e2.LeaveId join staticstatus e3 on e1.StatusId=e3.StatusId join staticstatus e4 on e1.ApprovalStatusId=e4.StatusId join employees on e1.EmployeeId=employees.EmployeeId where e1.EmployeeId=${id}`);
  //console.log(rows);
  return helper.emptyOrRows(rows);
};

const getApprovedleave = async () => {
  const rows = await db.query(`SELECT count(ApprovalStatusId) as ApprovalStatus from employeeLeaves e1 where e1.ApprovalStatusId=3`);
 // console.log(rows);
  return helper.emptyOrRows(rows);
};

const getRejectedleave = async () => {
  const rows = await db.query(`SELECT count(ApprovalStatusId) as RejectedStatus from employeeLeaves e1 where e1.ApprovalStatusId=4`);
  //console.log(rows);
  return helper.emptyOrRows(rows);
};

const getAppliedleave = async () => {
  const rows = await db.query(`SELECT count(StatusId) as AppliedleaveStatus from employeeLeaves e1 where e1.StatusId=1`);
  //console.log(rows);
  return helper.emptyOrRows(rows);
};

const getCancelleave = async () => {
  const rows = await db.query(`SELECT count(StatusId) as CancelLeaveStatus from employeeLeaves e1 where e1.StatusId=2`);
  //console.log(rows);
  return helper.emptyOrRows(rows);
};

const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT emp.FullName,emp.EmergencyPhone as Phone, empleaves.* FROM employeeleaves empleaves INNER join employees emp on empleaves.EmployeeId=emp.EmployeeId where empleaves.LeavesId=${id}`
    // `SELECT * FROM employeeLeaves  where LeavesId = ${id}`
  );
  return helper.emptyOrRows(rows);
};

const fetchleaveById = async (id) => {
  const rows = await db.query(
    `SELECT emp.FullName,emp.EmergencyPhone as Phone,leavetype.LeaveName,leavebalance.Balance as Remainingleave, empleaves.* FROM employeeleaves empleaves INNER join employees emp on empleaves.EmployeeId=emp.EmployeeId INNER join staticleavetypes leavetype on empleaves.LeaveTypeId=leavetype.LeaveId  INNER JOIN employeeleavebalances leavebalance on empleaves.LeaveTypeId=leavebalance.LeaveTypeId   where empleaves.LeavesId=${id}`
    // `SELECT * FROM employeeLeaves  where LeavesId = ${id}`
  );
  console.log("fatch Data", id);

  return helper.emptyOrRows(rows);
};
const updateleavestatus = async (Leave) => {
  
  const empleave=await db.query(`select ApprovalStatusId, StatusId from employeeleaves where LeaveFromDate='${Leave.LeaveFromDate}'`);


  var query = "";  
  var  msg = "";

  if((empleave[0].ApprovalStatusId!='5'||empleave[0].StatusId=='1')||((empleave[0].ApprovalStatusId!='4'||empleave[0].ApprovalStatusId=='3')&& empleave[0].StatusId=='1')){

  if (Leave.LeavesId > 0) {
    query = "update employeeLeaves set";
    query += ` ApprovalStatusId='${Leave.leavestatus=='2'?5:Leave.leavestatus=='4'?4:3}'`;
    query += `, StatusId='${Leave.leavestatus=='2'?2:1}'`;
    query += ` where LeavesId='${Leave.LeavesId}'`;
  }
  if(Leave.leavestatus=='2'||Leave.leavestatus=='4'){
    var UpdateleaveTransaction = "update employeeleavetransactions set";
    UpdateleaveTransaction += ` NoOfLeaveCredited='0'`;
    UpdateleaveTransaction += ` where LeaveTypeId='${Leave.LeaveTypeId}' and TransactionDate='${Leave.LeaveFromDate}' and EmployeeId='${Leave.EmployeeId}' `;
    

  await db.query(UpdateleaveTransaction);
  }

  await db.query(query);
  
    msg="Leave Status Update Successfully !";
}else{    
    msg="Leave Status Already Updated";
}

  return msg;
};


const fetchSickleave = async (data) => {
  const rows = await db.query(
    `SELECT  DATEDIFF(t2.LeaveToDate,t2.LeaveFromDate) as UsedSickleave,(t1.Balance-DATEDIFF(t2.LeaveToDate,t2.LeaveFromDate)) as UnusedSickLeave FROM employeeleavebalances t1 INNER JOIN employeeleaves t2 on t1.LeaveTypeId=t2.LeaveTypeId where t2.EmployeeId=${data} AND t1.LeaveTypeId=2  GROUP by t2.EmployeeId;`
  );
  return helper.emptyOrRows(rows);
};
const fetchCasualleave = async (data) => {
  const rows = await db.query(
    `SELECT(t1.Balance-DATEDIFF(t2.LeaveToDate,t2.LeaveFromDate)) as UnusedCasualLeave FROM employeeleavebalances t1 INNER JOIN employeeleaves t2 on t1.LeaveTypeId=t2.LeaveTypeId where t2.EmployeeId=${data} AND t1.LeaveTypeId=3;`
  );
  return helper.emptyOrRows(rows);
};
module.exports = {
  create,
  fetch,
  fetchById,
  updateleavestatus,
  getRejectedleave,
  getAppliedleave,
  getApprovedleave,
  getCancelleave,
  fetchSickleave,
  fetchCasualleave,
  fetchleaveByEmployee,
  fetchleaveById,
};
