const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const currentdate=new Date();
const create = async (ARTypeMaster) => {
  //const rows = await db.query(`SELECT *  FROM officelocation  where Location = ${location.Location}`);
  
  var query = "";
  var msg="";
  if ((ARTypeMaster.ARTypeId || 0) == 0) {
      // if(rows.length>0){
      //   msg="This location already has an office address !" 

      // }else{        
     query = `Insert Into ar_type_master (Code,DisplayDescription, SalaryComponentId)
     values ('${ARTypeMaster.Code}','${ARTypeMaster.DisplayDescription}','${ARTypeMaster.SalaryComponentId}')`;
     
     msg="AR Type Successfully Added !" 
  
    //}
    
  } else {
    query = "update ar_type_master set";
    query += ` Code='${ARTypeMaster.Code}'`;
    query += `, DisplayDescription='${ARTypeMaster.DisplayDescription}'`;
    query += `, SalaryComponentId='${ARTypeMaster.SalaryComponentId}'`;
    query += ` where ARTypeId='${ARTypeMaster.ARTypeId}'`;
    msg="AR Type Successfully Updated !";
    
  }
  if(query!=""){
    await db.query(query);
  }
  return msg;
};

const fetch = async () => {
  const rows = await db.query(`SELECT salarycomponents.EarningOrDeductionName, ARType.* FROM ar_type_master ARType INNER JOIN staticsalarycomponents salarycomponents on ARType.SalaryComponentId= salarycomponents.SalaryComponentsId`);
  return helper.emptyOrRows(rows);
};


const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM ar_type_master  where ARTypeId = ${id}`
  );
  return helper.emptyOrRows(rows);
};
const salarycomponents=async () => {
  const rows = await db.query(`SELECT * FROM staticsalarycomponents`);
  return helper.emptyOrRows(rows);
}
module.exports = {
  create,
  fetch,
  fetchById,
  salarycomponents,
};
