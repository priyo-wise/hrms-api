const db = require("./db");
const helper = require("../helper");
const config = require("../config");

async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM users LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}
async function getUserProfile(UserID) {
  const rows = await db.query(`SELECT * FROM users where UserID=${UserID}`);
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
}

async function create(performance) {
  const result = await db.query(
    `INSERT INTO users ( EmployeeCode, Designation, FullName, Email, FatherName, MotherName, Password, PermanentAddress, CommunicationAddress, DOB, DOJ, EmergencyPhone, Phone, Qualifications, ProfileImage, IdentityProof, AddressProof, ReportingManagerId, Approved, UserStatus, IsManager, IsHR, TimeStamp, LastModified) VALUES ( '${performance.EmployeeCode}', '${performance.Designation}', 'Priya', '', '', '', '', '', '', '', '', '', '', '', '', '', '', NULL, '0', 'I', '0', '0', current_timestamp(), current_timestamp())`
  );

  let message = "Error in creating Performance";

  if (result.affectedRows) {
    message = "User created successfully";
  }

  return { message };
}

async function UpdateUserProfile(userProfile) {
  const result = await db.query(
    `UPDATE users SET Email = '${userProfile.Email}', FullName='${userProfile.FullName}',
    PermanentAddress = '${userProfile.PermanentAddress}', CommunicationAddress = '${userProfile.CommunicationAddress}', DOB = '${userProfile.DOB}', DOJ ='${userProfile.DOJ}', EmergencyPhone ='${userProfile.EmergencyPhone}', 
    Phone = '${userProfile.Phone}', Qualifications = '${userProfile.Qualifications}' WHERE users.UserID = '${userProfile.UserID}';`
  );

  let message = "Error in updating User Profile";

  if (result.affectedRows) {
    message = "User Profile updated successfully";
  }

  return { message };
}

module.exports = {
  getMultiple,
  create,
  getUserProfile,
  UpdateUserProfile,
};
