const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const currentdate=new Date();
const create = async (Errorlog) => {
  const rows = await db.query(`SELECT *  FROM errortable  where ErrorNumber = ${Errorlog.ErrorNumber}`);
  
  var query = "";
  var msg="";
  if ((Errorlog.ErrorId || 0) == 0) {
      if(rows.length>0){
        msg="This type of leave Already Allocated" 

      }else{        
     query = `Insert Into errortable (ErrorNumber,ErrorCode, ErrorDescription)
     values ('${Errorlog.ErrorNumber}','${Errorlog.ErrorCode}','${Errorlog.ErrorDescription}')`;
     
     msg="Successfully Error Added" 
  
    }
    
  } else {
    query = "update errortable set";
    query += ` ErrorNumber='${Errorlog.ErrorNumber}'`;
    query += `, ErrorCode='${Errorlog.ErrorCode}'`;
    query += `, ErrorDescription='${Errorlog.ErrorDescription}'`;
    query += ` where ErrorId='${Errorlog.ErrorId}'`;
    msg="Error Updated Successfully";
    
  }
  if(query!=""){
    await db.query(query);
  }
  return msg;
};

const fetch = async () => {
  const rows = await db.query(`SELECT * FROM errortable;`);
  return helper.emptyOrRows(rows);
};


const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM errortable  where ErrorId = ${id}`
  );
  return helper.emptyOrRows(rows);
};
module.exports = {
  create,
  fetch,
  fetchById,
};
