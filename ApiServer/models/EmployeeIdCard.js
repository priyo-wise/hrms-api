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

const fetch = async (data) => {
  var msg="";
  const rows = await db.query(`SELECT employees.ExpireDate ,employees.IsIdCardActive , employees.FullName,employees.EmployeeCode, employees.Email as EmployeeEmail,employees.Designation,employees.DOB,employees.Phone,employees.ProfileImage,officelocation.Location,officelocation.Address,companyinformation.CompanyName,companyinformation.Email as CompanyEmail,companyinformation.Phone as CompanyPhone,companyinformation.State,companyinformation.city,companyinformation.pincode,companyinformation.Address1,companyinformation.Logo FROM employees INNER JOIN officelocation on employees.OfficeLocationId=officelocation.OfficeLocationId INNER JOIN companyinformation on officelocation.CompanyId=companyinformation.CompanyId WHERE employees.EmployeeId=${data.EmployeeId}`);
  if(rows.length>0){
    if(rows[0].IsIdCardActive=='Yes'){
      msg="Employee Id Card Already Created..!";
      return msg
    }else{
      var AddIDCard = "update employees set";
      AddIDCard += ` IsIdCardActive='Yes' `;
      AddIDCard += `, ExpireDate='${data.ExpireDate}' `;
      AddIDCard += ` where EmployeeId='${data.EmployeeId}' `;
  
      await db.query(AddIDCard);
      return helper.emptyOrRows(rows);

    }    
 }else{
  msg="Office location Data is Missing..!"
  return msg;
 }


};

const fetchActiveEmployeeIdCard = async () => {
  const rows = await db.query(`SELECT employees.ExpireDate ,employees.IsIdCardActive , employees.FullName,employees.EmployeeCode, employees.Email as EmployeeEmail,employees.Designation,employees.DOB,employees.Phone,employees.ProfileImage,officelocation.Location,officelocation.Address,companyinformation.CompanyName,companyinformation.Email as CompanyEmail,companyinformation.Phone as CompanyPhone,companyinformation.State,companyinformation.city,companyinformation.pincode,companyinformation.Address1,companyinformation.Logo FROM employees INNER JOIN officelocation on employees.OfficeLocationId=officelocation.OfficeLocationId INNER JOIN companyinformation on officelocation.CompanyId=companyinformation.CompanyId WHERE employees.IsIdCardActive='Yes'`);
  //console.log(rows);
  return helper.emptyOrRows(rows);
};

module.exports = {
  create,
  fetch,
  fetchActiveEmployeeIdCard,
};
