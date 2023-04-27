const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const currentdate=new Date();
const create = async (ARTypeMaster) => {
  //const rows = await db.query(`SELECT *  FROM officelocation  where Location = ${location.Location}`);
  
  var query = "";
  var msg="";
  if ((ARTypeMaster.ARInvoiceId || 0) == 0) {
      // if(rows.length>0){
      //   msg="This location already has an office address !" 

      // }else{        
     query = `Insert Into employee_salary_ar_invoice (EmployeeId,ARTypeId, TransactionNo,TransactionDate,TransactionMode,Amount)
     values ('${ARTypeMaster.EmployeeId}','${ARTypeMaster.ARTypeId}','${ARTypeMaster.TransactionNo}','${ARTypeMaster.TransactionDate}','${ARTypeMaster.TransactionMode}','${ARTypeMaster.Amount}')`;
     
     msg="AR Type Successfully Added !" 
  
    //}
    
  } else {
    query = "update employee_salary_ar_invoice set";
    query += ` EmployeeId='${ARTypeMaster.EmployeeId}'`;
    query += `, ARTypeId='${ARTypeMaster.ARTypeId}'`;
    query += `, TransactionNo='${ARTypeMaster.TransactionNo}'`;
    query += `, TransactionDate='${ARTypeMaster.TransactionDate}'`;
    query += `, TransactionMode='${ARTypeMaster.TransactionMode}'`;
    query += `, Amount='${ARTypeMaster.Amount}'`;
    query += ` where ARInvoiceId='${ARTypeMaster.ARInvoiceId}'`;
    msg="AR Type Successfully Updated !";
    
  }
  if(query!=""){
    await db.query(query);
  }
  return msg;
};

const fetch = async () => {
  const rows = await db.query(`SELECT employees.FullName,ar_type_master.DisplayDescription, employee_salary_ar_invoice.* FROM employee_salary_ar_invoice  INNER JOIN employees on employee_salary_ar_invoice.EmployeeId=employees.EmployeeId JOIN
  ar_type_master on employee_salary_ar_invoice.ARTypeId=ar_type_master.ARTypeId`);
  return helper.emptyOrRows(rows);
};


const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM  employee_salary_ar_invoice  where ARInvoiceId = ${id}`
  );
  return helper.emptyOrRows(rows);
};
const arTypecomponents=async () => {
  const rows = await db.query(`SELECT * FROM ar_type_master`);
  return helper.emptyOrRows(rows);
}
module.exports = {
  create,
  fetch,
  fetchById,
  arTypecomponents,
};
