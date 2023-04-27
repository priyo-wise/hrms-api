const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const currentdate=new Date();
const create = async (location) => {
  //const rows = await db.query(`SELECT *  FROM officelocation  where Location = ${location.Location}`);
  
  var query = "";
  var msg="";
  if ((location.OfficeLocationId || 0) == 0) {
      // if(rows.length>0){
      //   msg="This location already has an office address !" 

      // }else{        
     query = `Insert Into officelocation (CompanyId,Location, Address)
     values ('${location.CompanyId}','${location.Location}','${location.Address}')`;
     
     msg="Office address Successfully Added !" 
  
    //}
    
  } else {
    query = "update officelocation set";
    query += ` CompanyId='${location.CompanyId}'`;
    query += `, Location='${location.Location}'`;
    query += `, Address='${location.Address}'`;
    query += ` where OfficeLocationId='${location.OfficeLocationId}'`;
    msg="Office address Successfully Updated !";
    
  }
  if(query!=""){
    await db.query(query);
  }
  return msg;
};

const fetch = async () => {
  const rows = await db.query(`SELECT companyinformation.CompanyName,officelocation.* FROM officelocation INNER JOIN companyinformation on officelocation.CompanyId=companyinformation.CompanyId`);
  return helper.emptyOrRows(rows);
};


const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM officelocation  where OfficeLocationId = ${id}`
  );
  return helper.emptyOrRows(rows);
};
const getCompany=async () => {
  const rows = await db.query(`SELECT * FROM companyinformation`);
  return helper.emptyOrRows(rows);
}
module.exports = {
  create,
  fetch,
  fetchById,
  getCompany,
};
